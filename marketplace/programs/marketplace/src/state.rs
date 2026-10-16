
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Marketplace {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub fee_bps: u16,
}

#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub marketplace: Pubkey,
    pub seller: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub bump: u8,
    pub active: bool,
}
