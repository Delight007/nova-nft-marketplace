
use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

fn initialize_instruction(
    authority: &Keypair,
    treasury: Pubkey,
    fee_bps: u16,
) -> (LiteSVM, Pubkey, VersionedTransaction) {
    let program_id = marketplace::id();

    let marketplace_pda = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    )
    .0;

    let mut svm = LiteSVM::new();

    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/marketplace.so"
    ));

    svm.add_program(program_id, bytes).unwrap();

    svm.airdrop(&authority.pubkey(), 1_000_000_000)
        .unwrap();

    let instruction = Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
            fee_bps,
        }
        .data(),
        marketplace::accounts::InitializeMarketplace {
            marketplace: marketplace_pda,
            authority: authority.pubkey(),
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    let blockhash = svm.latest_blockhash();

    let message = Message::new_with_blockhash(
        &[instruction],
        Some(&authority.pubkey()),
        &blockhash,
    );

    let transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &[authority],
    )
    .unwrap();

    (svm, marketplace_pda, transaction)
}

#[test]
fn test_initialize_marketplace() {
    let authority = Keypair::new();
    let treasury = Keypair::new().pubkey();

    let (mut svm, marketplace_pda, transaction) =
        initialize_instruction(&authority, treasury, 250);

    let result = svm.send_transaction(transaction);

    assert!(
        result.is_ok(),
        "Marketplace initialization failed: {:?}",
        result.err()
    );

    let account = svm.get_account(&marketplace_pda).unwrap();
    let mut data: &[u8] = &account.data;

    let marketplace_state =
        marketplace::state::Marketplace::try_deserialize(&mut data).unwrap();

    assert_eq!(marketplace_state.authority, authority.pubkey());
    assert_eq!(marketplace_state.treasury, treasury);
    assert_eq!(marketplace_state.fee_bps, 250);
}

#[test]
fn test_initialize_marketplace_rejects_invalid_fee() {
    let authority = Keypair::new();
    let treasury = Keypair::new().pubkey();

    let (mut svm, marketplace_pda, transaction) =
        initialize_instruction(&authority, treasury, 10_001);

    let result = svm.send_transaction(transaction);

    assert!(
        result.is_err(),
        "Initialization should reject a fee above 10,000 basis points"
    );

    assert!(
        svm.get_account(&marketplace_pda).is_none(),
        "Marketplace account should not exist after failed initialization"
    );
}
