
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

// Sizes of classic SPL Token accounts.
const MINT_ACCOUNT_SIZE: usize = 82;
const TOKEN_ACCOUNT_SIZE: usize = 165;

// Helper: send a transaction to LiteSVM and fail if it doesn't succeed.
fn send_tx(
    svm: &mut LiteSVM,
    instructions: Vec<Instruction>,
    payer: &Keypair,
    signers: &[&Keypair],
) {
    let message = Message::new_with_blockhash(
        &instructions,
        Some(&payer.pubkey()),
        &svm.latest_blockhash(),
    );

    let mut all_signers = vec![payer];
    for signer in signers {
        if signer.pubkey() != payer.pubkey() {
            all_signers.push(signer);
        }
    }

    let tx = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &all_signers,
    )
    .unwrap();

    let result = svm.send_transaction(tx);

    if let Err(err) = result {
        panic!("Transaction failed: {err:?}");
    }
}

#[test]
fn test_cancel_listing_returns_nft_to_seller() {
    // Load the compiled marketplace program into LiteSVM.
    let mut svm = LiteSVM::new();
    let program_id = marketplace::ID;

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();

    // Create wallets and a mint for the NFT.
    let seller = Keypair::new();
    let treasury = Keypair::new();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();

    // Fund the seller and treasury so they can pay transaction costs
    // and the treasury account exists when queried.
    svm.airdrop(&seller.pubkey(), 5_000_000_000).unwrap();
    svm.airdrop(&treasury.pubkey(), 1_000_000).unwrap();

    // Derive the marketplace PDA.
    let (marketplace_pda, _) = Pubkey::find_program_address(
        &[b"marketplace"],
        &program_id,
    );

    // Initialize the marketplace with a 2.5% fee.
    let initialize_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::InitializeMarketplace {
            authority: seller.pubkey(),
            marketplace: marketplace_pda,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
        data: marketplace::instruction::InitializeMarketplace {
            treasury: treasury.pubkey(),
            fee_bps: 250,
        }
        .data(),
    };

    send_tx(&mut svm, vec![initialize_ix], &seller, &[]);

    // Create the NFT mint account.
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

    // Create the seller's token account to hold the NFT.
    let create_seller_token_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_seller_token_ix =
        spl_token::instruction::initialize_account(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    // Mint exactly one NFT to the seller.
    let mint_nft_ix = spl_token::instruction::mint_to(
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
        vec![
            create_mint_ix,
            initialize_mint_ix,
            create_seller_token_ix,
            initialize_seller_token_ix,
            mint_nft_ix,
        ],
        &seller,
        &[&mint, &seller_token_account],
    );

    // Derive the listing PDA and escrow token account PDA.
    let (listing_pda, _) = Pubkey::find_program_address(
        &[
            b"listing",
            marketplace_pda.as_ref(),
            mint.pubkey().as_ref(),
        ],
        &program_id,
    );

    let (escrow_pda, _) = Pubkey::find_program_address(
        &[b"escrow", listing_pda.as_ref()],
        &program_id,
    );

    // List the NFT for 1 SOL, moving it into escrow.
    let list_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::ListNft {
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
        data: marketplace::instruction::ListNft {
            price: 1_000_000_000,
        }
        .data(),
    };

    send_tx(&mut svm, vec![list_ix], &seller, &[]);

    // Verify that the NFT is in escrow before cancellation.
    let escrow_before = svm.get_account(&escrow_pda).unwrap();
    let escrow_amount_before = u64::from_le_bytes(
        escrow_before.data[64..72].try_into().unwrap(),
    );
    assert_eq!(escrow_amount_before, 1);

    // Cancel the listing. The seller signs the instruction;
    // the marketplace program uses the listing PDA to release the NFT.
    let cancel_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::CancelListing {
            marketplace: marketplace_pda,
            listing: listing_pda,
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            escrow_token_account: escrow_pda,
            seller_token_account: seller_token_account.pubkey(),
            token_program: token_program_id,
        }
        .to_account_metas(None),
        data: marketplace::instruction::CancelListing {}.data(),
    };

    send_tx(&mut svm, vec![cancel_ix], &seller, &[]);

   
    // Verify that the seller now holds the NFT again.
    let seller_token_account_data =
        svm.get_account(&seller_token_account.pubkey()).unwrap();

    let seller_amount = u64::from_le_bytes(
        seller_token_account_data.data[64..72]
            .try_into()
            .unwrap(),
    );

    assert_eq!(
        seller_amount, 1,
        "NFT should be returned to the seller"
    );

    // Verify that the escrow token account is closed.
    assert!(
        svm.get_account(&escrow_pda).is_none(),
        "Escrow token account should be closed"
    );

    // Verify that the listing account is closed.
    assert!(
        svm.get_account(&listing_pda).is_none(),
        "Listing account should be closed"
    );

    
    // Relist the same NFT using the same listing and escrow PDAs.
    let relist_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::ListNft {
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
        data: marketplace::instruction::ListNft {
            price: 2_000_000_000, // 2 SOL
        }
        .data(),
    };

    send_tx(&mut svm, vec![relist_ix], &seller, &[]);

    // Confirm that the NFT is back in escrow.
    let escrow_after_relist = svm.get_account(&escrow_pda).unwrap();

    let escrow_amount = u64::from_le_bytes(
        escrow_after_relist.data[64..72]
            .try_into()
            .unwrap(),
    );

    assert_eq!(escrow_amount, 1, "NFT should be back in escrow");

    // Confirm that the new listing is active and has the updated price.
    let listing_account = svm.get_account(&listing_pda).unwrap();

    let listing = marketplace::Listing::try_deserialize(
        &mut listing_account.data.as_slice(),
    )
    .unwrap();

    assert!(listing.active, "Relisted NFT should be active");
    assert_eq!(listing.price, 2_000_000_000, "Price should be 2 SOL");

    // Confirm that the seller no longer holds the NFT.
    let seller_account = svm
        .get_account(&seller_token_account.pubkey())
        .unwrap();

    let seller_amount = u64::from_le_bytes(
        seller_account.data[64..72]
            .try_into()
            .unwrap(),
    );

    assert_eq!(seller_amount, 0, "NFT should leave the seller's account");

}



#[test]
fn test_unauthorized_user_cannot_cancel_listing() {
    // Load the marketplace program into LiteSVM.
    let mut svm = LiteSVM::new();
    let program_id = marketplace::ID;

    let program_bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, program_bytes).unwrap();

    // Create the legitimate seller and an unauthorized attacker.
    let seller = Keypair::new();
    let attacker = Keypair::new();
    let treasury = Keypair::new();
    let mint = Keypair::new();
    let seller_token_account = Keypair::new();

    // Fund both wallets for transaction fees and account creation.
    svm.airdrop(&seller.pubkey(), 5_000_000_000).unwrap();
    svm.airdrop(&attacker.pubkey(), 5_000_000_000).unwrap();

    // Derive the marketplace PDA.
    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    // Initialize the marketplace.
    let initialize_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::InitializeMarketplace {
            authority: seller.pubkey(),
            marketplace: marketplace_pda,
            system_program: anchor_lang::system_program::ID,
        }
        .to_account_metas(None),
        data: marketplace::instruction::InitializeMarketplace {
            treasury: treasury.pubkey(),
            fee_bps: 250,
        }
        .data(),
    };

    send_tx(&mut svm, vec![initialize_ix], &seller, &[]);

    // Create a classic SPL Token mint for a one-of-one NFT.
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

    // Create the seller's token account.
    let create_token_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_token_ix =
        spl_token::instruction::initialize_account(
            &token_program_id,
            &seller_token_account.pubkey(),
            &mint.pubkey(),
            &seller.pubkey(),
        )
        .unwrap();

    // Mint exactly one NFT to the seller.
    let mint_nft_ix = spl_token::instruction::mint_to(
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
        vec![
            create_mint_ix,
            initialize_mint_ix,
            create_token_ix,
            initialize_token_ix,
            mint_nft_ix,
        ],
        &seller,
        &[&mint, &seller_token_account],
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

    // The legitimate seller lists the NFT for 1 SOL.
    let list_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::ListNft {
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
        data: marketplace::instruction::ListNft {
            price: 1_000_000_000,
        }
        .data(),
    };

    send_tx(&mut svm, vec![list_ix], &seller, &[]);

    // Confirm that the NFT is held in escrow before the attack.
    let escrow_before = svm.get_account(&escrow_pda).unwrap();
    let amount_before = u64::from_le_bytes(
        escrow_before.data[64..72].try_into().unwrap(),
    );

    assert_eq!(amount_before, 1);

    // The attacker attempts to cancel the seller's listing.
    // Notice that the attacker is supplied as the seller signer.
    let cancel_ix = Instruction {
        program_id,
        accounts: marketplace::accounts::CancelListing {
            marketplace: marketplace_pda,
            listing: listing_pda,
            seller: attacker.pubkey(),
            mint: mint.pubkey(),
            escrow_token_account: escrow_pda,
            seller_token_account: seller_token_account.pubkey(),
            token_program: token_program_id,
        }
        .to_account_metas(None),
        data: marketplace::instruction::CancelListing {}.data(),
    };

    // The transaction must fail because the attacker is not the seller.
    let message = Message::new_with_blockhash(
        &[cancel_ix],
        Some(&attacker.pubkey()),
        &svm.latest_blockhash(),
    );

    let tx = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &[&attacker],
    )
    .unwrap();

    let result = svm.send_transaction(tx);

    assert!(
        result.is_err(),
        "An unauthorized user must not cancel another seller's listing"
    );

    // Confirm the failed transaction did not move the NFT.
    let escrow_after = svm.get_account(&escrow_pda).unwrap();
    let amount_after = u64::from_le_bytes(
        escrow_after.data[64..72].try_into().unwrap(),
    );

    assert_eq!(
        amount_after, 1,
        "The NFT must remain in escrow after the rejected attempt"
    );

    // Confirm the original listing remains active.
    let listing_account = svm.get_account(&listing_pda).unwrap();
    let mut listing_data: &[u8] = &listing_account.data;

    let listing =
        marketplace::state::Listing::try_deserialize(&mut listing_data)
            .unwrap();

    assert!(listing.active, "The listing must remain active");
    assert_eq!(
        listing.seller,
        seller.pubkey(),
        "The original seller must remain unchanged"
    );
}

