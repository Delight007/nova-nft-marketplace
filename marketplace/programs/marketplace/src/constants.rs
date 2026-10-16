use anchor_lang::prelude::*;

#[constant]
pub const MARKETPLACE_SEED: &[u8] = b"marketplace";

pub const LISTING_SEED: &[u8] = b"listing";
pub const ESCROW_SEED: &[u8] = b"escrow";

pub const MAX_FEE_BPS: u16 = 10_000;