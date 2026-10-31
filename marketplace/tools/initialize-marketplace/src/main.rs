use anchor_lang::{
    prelude::Pubkey,
    solana_program::system_program,
    AccountDeserialize,
    InstructionData,
    ToAccountMetas,
};

use solana_keypair::read_keypair_file;
use solana_message::{Message, VersionedMessage};
use solana_rpc_client::rpc_client::RpcClient;
use solana_signer::Signer;
use solana_transaction::versioned::VersionedTransaction;

use std::error::Error;
use std::str::FromStr;

fn main() -> Result<(), Box<dyn Error>> {
    // Connect to Solana Devnet
    let rpc_url = "https://api.devnet.solana.com";
    let client = RpcClient::new(rpc_url.to_string());

    // Load the existing wallet
    let wallet_path = dirs::home_dir()
        .ok_or("Could not find home directory")?
        .join(".config/solana/id.json");

    let payer = read_keypair_file(wallet_path)?;

    println!("Wallet: {}", payer.pubkey());

    // Use the wallet as the treasury for Devnet testing
    let treasury = payer.pubkey();

    // Marketplace configuration
    let fee_bps: u16 = 250;

    // Get the deployed program ID
    let program_id = Pubkey::from_str(
        "2xUScUbtGaJkpS2xsLrAzGTm9EpjV7U7CumTVeYcYf59",
    )?;

    // Derive the Marketplace PDA
    let (marketplace_pda, _) = Pubkey::find_program_address(
        &[marketplace::constants::MARKETPLACE_SEED],
        &program_id,
    );

    println!("Marketplace PDA: {}", marketplace_pda);

    // Check whether the Marketplace PDA already exists
    if let Ok(account) = client.get_account(&marketplace_pda) {
        let mut account_data = account.data.as_slice();

        let marketplace_state =
            marketplace::state::Marketplace::try_deserialize(
                &mut account_data,
            )?;

        println!("Marketplace is already initialized.");
        println!("Authority: {}", marketplace_state.authority);
        println!("Treasury: {}", marketplace_state.treasury);
        println!("Fee: {} basis points", marketplace_state.fee_bps);

        return Ok(());
    }

    println!("Marketplace not initialized. Initializing now...");

    // Create the initialize_marketplace instruction
    let instruction = anchor_lang::solana_program::instruction::Instruction::new_with_bytes(
        program_id,
        &marketplace::instruction::InitializeMarketplace {
            treasury,
            fee_bps,
        }
        .data(),
        marketplace::accounts::InitializeMarketplace {
            marketplace: marketplace_pda,
            authority: payer.pubkey(),
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    );

    // Create the transaction message
    let recent_blockhash = client.get_latest_blockhash()?;

    let message = Message::new_with_blockhash(
        &[instruction],
        Some(&payer.pubkey()),
        &recent_blockhash,
    );

    // Sign the transaction
    let transaction = VersionedTransaction::try_new(
        VersionedMessage::Legacy(message),
        &[&payer],
    )?;

    // Submit and confirm the transaction
    let signature = client.send_and_confirm_transaction(&transaction)?;

    println!("Marketplace initialized successfully!");
    println!("Transaction: {}", signature);
    println!("Marketplace PDA: {}", marketplace_pda);
    println!("Treasury: {}", treasury);
    println!("Marketplace fee: {} basis points (2.5%)", fee_bps);

    Ok(())
}