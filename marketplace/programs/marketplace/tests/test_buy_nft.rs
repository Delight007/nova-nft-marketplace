
use anchor_lang::{
    prelude::Pubkey,
    solana_program::instruction::Instruction,
    AccountDeserialize, InstructionData, ToAccountMetas,
};
use anchor_spl::token::spl_token;
use litesvm::LiteSVM;
use solana_keypair::Keypair;
use solana_message::{Message, VersionedMessage};
use solana_signer::Signer;
use solana_transaction::versioned::VersionedTransaction;
use solana_system_interface::instruction as system_instruction;

const MINT_ACCOUNT_SIZE: usize = 82;
const TOKEN_ACCOUNT_SIZE: usize = 165;

fn send_tx(
    svm: &mut LiteSVM,
    payer: &Keypair,
    signers: &[&Keypair],
    instructions: &[Instruction],
) {
    let blockhash = svm.latest_blockhash();

    let message = Message::new_with_blockhash(
        instructions,
        Some(&payer.pubkey()),
        &blockhash,
    );

    let transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        signers,
    )
    .unwrap();

    let result = svm.send_transaction(transaction);

    assert!(
        result.is_ok(),
        "Transaction failed: {:?}",
        result.err()
    );
}


#[test]
fn test_buy_nft_transfers_payment_and_nft() {
    let program_id = marketplace::id();

    let seller = Keypair::new();
    let buyer = Keypair::new();
    let treasury = Keypair::new();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();
    let buyer_token_account = Keypair::new();

    let mut svm = LiteSVM::new();

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();

    // Fund the seller and buyer with SOL.
    svm.airdrop(&seller.pubkey(), 5_000_000_000)
        .unwrap();

    svm.airdrop(&buyer.pubkey(), 5_000_000_000)
        .unwrap();

    svm.airdrop(&treasury.pubkey(), 1_000_000)
    .unwrap();

        
    // Derive the marketplace PDA.
    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    // Initialize the marketplace with a 2.5% fee.
    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury: treasury.pubkey(),
            fee_bps: 250,
        }
        .data(),
        marketplace::accounts::InitializeMarketplace {
            marketplace: marketplace_pda,
            authority: seller.pubkey(),
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );
     send_tx(
        &mut svm,
        &seller,
        &[&seller],
        &[initialize_ix],
    );


    
    // Create the NFT mint account and seller token account.
    let token_program_id = spl_token::ID;

    let create_mint_ix = system_instruction::create_account(
        &seller.pubkey(),
        &mint.pubkey(),
        svm.minimum_balance_for_rent_exemption(MINT_ACCOUNT_SIZE),
        MINT_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_mint_ix = spl_token::instruction::initialize_mint(
        &token_program_id,
        &mint.pubkey(),
        &seller.pubkey(),
        None,
        0,
    )
    .unwrap();

    let create_seller_token_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_seller_token_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    let mint_one_nft_ix = spl_token::instruction::mint_to(
        &token_program_id,
        &mint.pubkey(),
        &seller_token_account.pubkey(),
        &seller.pubkey(),
        &[],
        1,
    )
    .unwrap();

    send_tx(
        &mut svm,
        &seller,
        &[&seller, &mint, &seller_token_account],
        &[
            create_mint_ix,
            initialize_mint_ix,
            create_seller_token_ix,
            initialize_seller_token_ix,
            mint_one_nft_ix,
        ],
    );


    
    // Derive the listing and escrow PDAs.
    let listing_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::LISTING_SEED,
            marketplace_pda.as_ref(),
            mint.pubkey().as_ref(),
        ],
        &program_id,
    )
    .0;

    let escrow_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::ESCROW_SEED,
            listing_pda.as_ref(),
        ],
        &program_id,
    )
    .0;

    // List the NFT for 1 SOL.
    let price = 1_000_000_000u64;

    let list_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::ListNft { price }.data(),
        marketplace::accounts::ListNft {
            marketplace: marketplace_pda,
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            seller_token_account: seller_token_account.pubkey(),
            listing: listing_pda,
            escrow_token_account: escrow_pda,
            token_program: token_program_id,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );

    send_tx(
        &mut svm,
        &seller,
        &[&seller],
        &[list_ix],
    );


    
    // Create the buyer's token account.
    let create_buyer_token_ix = system_instruction::create_account(
        &buyer.pubkey(),
        &buyer_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_buyer_token_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &buyer_token_account.pubkey(),
            &mint.pubkey(),
            &buyer.pubkey(),
        )
        .unwrap();

    send_tx(
        &mut svm,
        &buyer,
        &[&buyer, &buyer_token_account],
        &[
            create_buyer_token_ix,
            initialize_buyer_token_ix,
        ],
    );


    
    // Buy the NFT.
    let buy_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::BuyNft {}.data(),
        marketplace::accounts::BuyNft {
            marketplace: marketplace_pda,
            listing: listing_pda,
            buyer: buyer.pubkey(),
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            escrow_token_account: escrow_pda,
            buyer_token_account: buyer_token_account.pubkey(),
            treasury: treasury.pubkey(),
            token_program: token_program_id,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );

    
    // Record balances before the purchase.
    let seller_balance_before =
        svm.get_balance(&seller.pubkey()).unwrap();

    let treasury_balance_before =
        svm.get_balance(&treasury.pubkey()).unwrap();

    send_tx(
        &mut svm,
        &buyer,
        &[&buyer],
        &[buy_ix],
    );

    
    // Verify the seller received 0.975 SOL.
    let seller_balance_after =
        svm.get_balance(&seller.pubkey()).unwrap();

    assert_eq!(
        seller_balance_after - seller_balance_before,
        975_000_000,
        "Seller should receive 0.975 SOL"
    );

    // Verify the treasury received the 2.5% fee.
    let treasury_balance_after =
        svm.get_balance(&treasury.pubkey()).unwrap();

    assert_eq!(
        treasury_balance_after - treasury_balance_before,
        25_000_000,
        "Treasury should receive 0.025 SOL"
    );

    // Verify the buyer received the NFT.
    let buyer_token = svm
        .get_account(&buyer_token_account.pubkey())
        .unwrap();

    let buyer_amount = u64::from_le_bytes(
        buyer_token.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        buyer_amount,
        1,
        "Buyer should receive exactly one NFT"
    );

    // Verify escrow no longer holds the NFT.
    let escrow_token = svm.get_account(&escrow_pda).unwrap();

    let escrow_amount = u64::from_le_bytes(
        escrow_token.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        escrow_amount,
        0,
        "Escrow should no longer hold the NFT"
    );

    // Verify the listing is inactive.
    let listing_account = svm.get_account(&listing_pda).unwrap();
    let mut listing_data: &[u8] = &listing_account.data;

    let listing =
        marketplace::state::Listing::try_deserialize(&mut listing_data)
            .unwrap();

    assert!(
        !listing.active,
        "Listing should be inactive after purchase"
    );


    
    // Attempt to buy the same NFT again after it has been sold.
    let second_buy_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::BuyNft {}.data(),
        marketplace::accounts::BuyNft {
            marketplace: marketplace_pda,
            listing: listing_pda,
            buyer: buyer.pubkey(),
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            escrow_token_account: escrow_pda,
            buyer_token_account: buyer_token_account.pubkey(),
            treasury: treasury.pubkey(),
            token_program: token_program_id,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );

    let second_buy_message = Message::new_with_blockhash(
        &[second_buy_ix],
        Some(&buyer.pubkey()),
        &svm.latest_blockhash(),
    );

    let second_buy_transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(second_buy_message),
        &[&buyer],
    )
    .unwrap();

    let second_buy_result = svm.send_transaction(second_buy_transaction);

    assert!(
        second_buy_result.is_err(),
        "A sold NFT must not be purchased again"
    );

    // Confirm the first buyer still owns the NFT.
    let buyer_token_after = svm
        .get_account(&buyer_token_account.pubkey())
        .unwrap();

    let buyer_amount_after = u64::from_le_bytes(
        buyer_token_after.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        buyer_amount_after, 1,
        "The first buyer must retain the NFT"
    );

    // Confirm the listing remains inactive.
    let listing_account_after = svm.get_account(&listing_pda).unwrap();
    let mut listing_data_after: &[u8] = &listing_account_after.data;

    let listing_after =
        marketplace::state::Listing::try_deserialize(&mut listing_data_after)
            .unwrap();

    assert!(
        !listing_after.active,
        "The listing must remain inactive after the rejected purchase"
    );

 
}


#[test]
fn test_seller_cannot_buy_own_nft() {
    let program_id = marketplace::id();

    let seller = Keypair::new();
    let buyer = Keypair::new();
    let treasury = Keypair::new();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();
    let buyer_token_account = Keypair::new();

    let mut svm = LiteSVM::new();

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();

    // Fund the seller and buyer so they can initialize accounts.
    svm.airdrop(&seller.pubkey(), 5_000_000_000).unwrap();
    svm.airdrop(&buyer.pubkey(), 5_000_000_000).unwrap();
    svm.airdrop(&treasury.pubkey(), 1_000_000).unwrap();

    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    // Initialize the marketplace with a 2.5% fee.
    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury: treasury.pubkey(),
            fee_bps: 250,
        }
        .data(),
        marketplace::accounts::InitializeMarketplace {
            marketplace: marketplace_pda,
            authority: seller.pubkey(),
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );

    send_tx(&mut svm, &seller, &[&seller], &[initialize_ix]);

    // Create the NFT mint and seller token account.
    let token_program_id = spl_token::ID;

    let create_mint_ix = system_instruction::create_account(
        &seller.pubkey(),
        &mint.pubkey(),
        svm.minimum_balance_for_rent_exemption(MINT_ACCOUNT_SIZE),
        MINT_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_mint_ix = spl_token::instruction::initialize_mint(
        &token_program_id,
        &mint.pubkey(),
        &seller.pubkey(),
        None,
        0,
    )
    .unwrap();

    let create_seller_token_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_seller_token_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    let mint_one_nft_ix = spl_token::instruction::mint_to(
        &token_program_id,
        &mint.pubkey(),
        &seller_token_account.pubkey(),
        &seller.pubkey(),
        &[],
        1,
    )
    .unwrap();

    send_tx(
        &mut svm,
        &seller,
        &[&seller, &mint, &seller_token_account],
        &[
            create_mint_ix,
            initialize_mint_ix,
            create_seller_token_ix,
            initialize_seller_token_ix,
            mint_one_nft_ix,
        ],
    );

    // Derive the listing and escrow PDAs.
    let listing_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::LISTING_SEED,
            marketplace_pda.as_ref(),
            mint.pubkey().as_ref(),
        ],
        &program_id,
    )
    .0;

    let escrow_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::ESCROW_SEED,
            listing_pda.as_ref(),
        ],
        &program_id,
    )
    .0;

    // List the NFT for 1 SOL.
    let price = 1_000_000_000u64;

    let list_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::ListNft { price }.data(),
        marketplace::accounts::ListNft {
            marketplace: marketplace_pda,
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            seller_token_account: seller_token_account.pubkey(),
            listing: listing_pda,
            escrow_token_account: escrow_pda,
            token_program: token_program_id,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
    );

    send_tx(&mut svm, &seller, &[&seller], &[list_ix]);

    // Create the buyer's token account while the buyer has enough SOL.
    let create_buyer_token_ix = system_instruction::create_account(
        &buyer.pubkey(),
        &buyer_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_buyer_token_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &buyer_token_account.pubkey(),
            &mint.pubkey(),
            &buyer.pubkey(),
        )
        .unwrap();

    send_tx(
        &mut svm,
        &buyer,
        &[&buyer, &buyer_token_account],
        &[create_buyer_token_ix, initialize_buyer_token_ix],
    );

    
    let treasury_balance_before = svm.get_balance(&treasury.pubkey()).unwrap();

    // Attempt to buy the NFT.
    let buy_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::BuyNft {}.data(),
        marketplace::accounts::BuyNft {
    marketplace: marketplace_pda,
    listing: listing_pda,
    buyer: seller.pubkey(),
    seller: seller.pubkey(),
    mint: mint.pubkey(),
    escrow_token_account: escrow_pda,
    buyer_token_account: seller_token_account.pubkey(),
    treasury: treasury.pubkey(),
    token_program: token_program_id,
    system_program: anchor_lang::system_program::ID,
}
        .to_account_metas(None),
    );
    

    let message = Message::new_with_blockhash(
    &[buy_ix],
    Some(&seller.pubkey()),
    &svm.latest_blockhash(),
);

let transaction = VersionedTransaction::try_new(
    VersionedMessage::Legacy(message),
    &[&seller],
)
.unwrap();

let result = svm.send_transaction(transaction);

assert!(
    result.is_err(),
    "Seller must not be able to buy their own NFT"
);
  
    // Nor should it transfer a marketplace fee.
    assert_eq!(
        svm.get_balance(&treasury.pubkey()).unwrap(),
        treasury_balance_before,
        "Treasury balance must not change after a failed purchase"
    );

    // The NFT must remain in escrow.
    let escrow_account = svm.get_account(&escrow_pda).unwrap();

    let escrow_amount = u64::from_le_bytes(
        escrow_account.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        escrow_amount,
        1,
        "NFT must remain in escrow after a failed purchase"
    );

    // The listing must remain active.
    let listing_account = svm.get_account(&listing_pda).unwrap();
    let mut listing_data: &[u8] = &listing_account.data;

    let listing =
        marketplace::state::Listing::try_deserialize(&mut listing_data)
            .unwrap();

    assert!(
        listing.active,
        "Listing must remain active after a failed purchase"
    );

    // The buyer must not receive the NFT.
    let buyer_token = svm.get_account(&buyer_token_account.pubkey()).unwrap();

    let buyer_amount = u64::from_le_bytes(
        buyer_token.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        buyer_amount,
        0,
        "Buyer must not receive the NFT after a failed purchase"
    );
}

