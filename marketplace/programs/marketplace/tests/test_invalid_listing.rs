
use anchor_lang::{
    prelude::Pubkey,
    solana_program::instruction::Instruction,
    InstructionData, ToAccountMetas,
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

#[test]
fn test_listing_rejects_zero_price() {
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
    ).0;

    let initialize_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
            fee_bps: 250,
        }.data(),
        marketplace::accounts::InitializeMarketplace {
            marketplace: marketplace_pda,
            authority: seller.pubkey(),
            system_program: anchor_lang::system_program::ID,
        }.to_account_metas(None),
    );

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
    ).unwrap();

    let create_token_ix = system_instruction::create_account(
        &seller.pubkey(),
        &seller_token_account.pubkey(),
        svm.minimum_balance_for_rent_exemption(TOKEN_ACCOUNT_SIZE),
        TOKEN_ACCOUNT_SIZE as u64,
        &token_program_id,
    );

    let initialize_token_ix = spl_token::instruction::initialize_account3(
        &token_program_id,
        &seller_token_account.pubkey(),
        &mint.pubkey(),
        &seller.pubkey(),
    ).unwrap();

    let mint_nft_ix = spl_token::instruction::mint_to(
        &token_program_id,
        &mint.pubkey(),
        &seller_token_account.pubkey(),
        &seller.pubkey(),
        &[],
        1,
    ).unwrap();

    let blockhash = svm.latest_blockhash();
    let setup_instructions = [
        initialize_ix,
        create_mint_ix,
        initialize_mint_ix,
        create_token_ix,
        initialize_token_ix,
        mint_nft_ix,
    ];
    let message = Message::new_with_blockhash(
        &setup_instructions,
        Some(&seller.pubkey()),
        &blockhash,
    );
    let transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &[&seller, &mint, &seller_token_account],
    ).unwrap();

    let setup_result = svm.send_transaction(transaction);
    assert!(
        setup_result.is_ok(),
        "Test setup failed: {:?}",
        setup_result.err()
    );

    let listing_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::LISTING_SEED,
            marketplace_pda.as_ref(),
            mint.pubkey().as_ref(),
        ],
        &program_id,
    ).0;

    let escrow_pda = Pubkey::find_program_address(
        &[
            marketplace::constants::ESCROW_SEED,
            listing_pda.as_ref(),
        ],
        &program_id,
    ).0;

    let list_ix = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::ListNft { price: 0 }.data(),
        marketplace::accounts::ListNft {
            marketplace: marketplace_pda,
            seller: seller.pubkey(),
            mint: mint.pubkey(),
            seller_token_account: seller_token_account.pubkey(),
            listing: listing_pda,
            escrow_token_account: escrow_pda,
            token_program: token_program_id,
            system_program: anchor_lang::system_program::ID,
        }.to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();
    let message = Message::new_with_blockhash(
        &[list_ix],
        Some(&seller.pubkey()),
        &blockhash,
    );
    let transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &[&seller],
    ).unwrap();

    let result = svm.send_transaction(transaction);

    assert!(
        result.is_err(),
        "Listing with a zero price should fail"
    );
    assert!(
        svm.get_account(&listing_pda).is_none(),
        "Listing account should not exist after a failed transaction"
    );
}
