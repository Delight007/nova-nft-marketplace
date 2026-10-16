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
fn test_list_nft_transfers_nft_into_escrow() {
    let program_id = marketplace::id();
    let seller = Keypair::new();
    let treasury = Keypair::new().pubkey();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();

    let mut svm = LiteSVM::new();

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();

    svm.airdrop(&seller.pubkey(), 5_000_000_000)
        .unwrap();

    // Derive marketplace PDA.
    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    // Initialize marketplace.
    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
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

    let create_token_account_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_token_account_ix =
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
            create_token_account_ix,
            initialize_token_account_ix,
            mint_one_nft_ix,
        ],
    );

    // Derive listing and escrow PDAs.
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

    // Verify listing state.
    let listing_account = svm.get_account(&listing_pda).unwrap();
    let mut listing_data: &[u8] = &listing_account.data;

    let listing =
        marketplace::state::Listing::try_deserialize(&mut listing_data)
            .unwrap();

    assert_eq!(listing.seller, seller.pubkey());
    assert_eq!(listing.mint, mint.pubkey());
    assert_eq!(listing.price, price);
    assert!(listing.active);

    // Verify the NFT moved from seller to escrow.
    let seller_token = svm
        .get_account(&seller_token_account.pubkey())
        .unwrap();

    let escrow_token = svm.get_account(&escrow_pda).unwrap();

    let seller_amount = u64::from_le_bytes(
        seller_token.data[64..72].try_into().unwrap(),
    );

    let escrow_amount = u64::from_le_bytes(
        escrow_token.data[64..72].try_into().unwrap(),
    );

    assert_eq!(seller_amount, 0, "Seller should no longer hold the NFT");
    assert_eq!(escrow_amount, 1, "Escrow should hold exactly one NFT");
}


#[test]
fn test_listing_rejects_when_seller_has_zero_nfts() {
    let program_id = marketplace::id();
    let seller = Keypair::new();
    let treasury = Keypair::new().pubkey();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();

    let mut svm = LiteSVM::new();

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();
    svm.airdrop(&seller.pubkey(), 5_000_000_000).unwrap();

    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
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

    let create_token_account_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_token_account_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    // Create the mint and token account, but do NOT mint any tokens.
    send_tx(
        &mut svm,
        &seller,
        &[&seller, &mint, &seller_token_account],
        &[
            create_mint_ix,
            initialize_mint_ix,
            create_token_account_ix,
            initialize_token_account_ix,
        ],
    );

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

    let list_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::ListNft {
            price: 1_000_000_000,
        }
        .data(),
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

    let message = Message::new_with_blockhash(
        &[list_ix],
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
        "Listing must fail when the seller owns zero NFTs"
    );

    // A failed transaction must not leave a listing account behind.
    assert!(
        svm.get_account(&listing_pda).is_none(),
        "No listing account should be created"
    );
}



#[test]
fn test_listing_rejects_fungible_token() {
    let program_id = marketplace::id();
    let seller = Keypair::new();
    let treasury = Keypair::new().pubkey();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();

    let mut svm = LiteSVM::new();

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();
    svm.airdrop(&seller.pubkey(), 5_000_000_000).unwrap();

    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
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

    let create_token_account_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_token_account_ix =
        spl_token::instruction::initialize_account3(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    let mint_two_tokens_ix = spl_token::instruction::mint_to(
        &token_program_id,
        &mint.pubkey(),
        &seller_token_account.pubkey(),
        &seller.pubkey(),
        &[],
        2,
    )
    .unwrap();

    send_tx(
        &mut svm,
        &seller,
        &[&seller, &mint, &seller_token_account],
        &[
            create_mint_ix,
            initialize_mint_ix,
            create_token_account_ix,
            initialize_token_account_ix,
            mint_two_tokens_ix,
        ],
    );

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

    let list_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::ListNft {
            price: 1_000_000_000,
        }
        .data(),
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

    let message = Message::new_with_blockhash(
        &[list_ix],
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
        "Listing must fail when the mint supply is greater than one"
    );

    assert!(
        svm.get_account(&listing_pda).is_none(),
        "No listing account should be created"
    );
}