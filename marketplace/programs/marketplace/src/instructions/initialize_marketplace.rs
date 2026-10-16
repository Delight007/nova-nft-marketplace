use anchor_lang::prelude::*;

use crate::state::Marketplace;

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Marketplace::INIT_SPACE,
        seeds = [crate::constants::MARKETPLACE_SEED],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_marketplace(
    ctx: Context<InitializeMarketplace>,
    treasury: Pubkey,
    fee_bps: u16,
) -> Result<()> {

    require!(
    fee_bps <= crate::constants::MAX_FEE_BPS,
    crate::error::ErrorCode::InvalidMarketplaceFee
    );

    let marketplace = &mut ctx.accounts.marketplace;

    marketplace.authority = ctx.accounts.authority.key();
    marketplace.treasury = treasury;
    marketplace.fee_bps = fee_bps;

    Ok(())
}
