pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("2xUScUbtGaJkpS2xsLrAzGTm9EpjV7U7CumTVeYcYf59");

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize_marketplace(
        ctx: Context<InitializeMarketplace>,
        treasury: Pubkey,
        fee_bps: u16,
    ) -> Result<()> {
        crate::instructions::initialize_marketplace::handle_initialize_marketplace(
            ctx,
            treasury,
            fee_bps,
        )
    }

     pub fn list_nft(
        ctx: Context<ListNft>,
        price: u64,
    ) -> Result<()> {
        crate::instructions::list_nft::handle_list_nft(ctx, price)
    }

    pub fn buy_nft(ctx: Context<BuyNft>) -> Result<()> {
    crate::instructions::buy_nft::handle_buy_nft(ctx)
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
    crate::instructions::cancel_listing::handle_cancel_listing(ctx)
}
}