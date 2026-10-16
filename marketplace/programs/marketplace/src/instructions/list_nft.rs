use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::constants::{ESCROW_SEED, LISTING_SEED};

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct ListNft<'info> {
    #[account(
        seeds = [crate::constants::MARKETPLACE_SEED],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = seller_token_account.mint == mint.key(),
        constraint = seller_token_account.owner == seller.key(),
        constraint = seller_token_account.amount == 1
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::INIT_SPACE,
        seeds = [
            LISTING_SEED,
            marketplace.key().as_ref(),
            mint.key().as_ref()
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        init,
        payer = seller,
        seeds = [ESCROW_SEED, listing.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = listing,
        token::token_program = token_program
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_list_nft(ctx: Context<ListNft>, price: u64) -> Result<()> {
    require!(price > 0, crate::error::ErrorCode::InvalidPrice);

    require!(
        ctx.accounts.mint.decimals == 0 && ctx.accounts.mint.supply == 1,
        crate::error::ErrorCode::InvalidNft
    );

    let listing = &mut ctx.accounts.listing;

    listing.marketplace = ctx.accounts.marketplace.key();
    listing.seller = ctx.accounts.seller.key();
    listing.mint = ctx.accounts.mint.key();
    listing.price = price;
    listing.bump = ctx.bumps.listing;
    listing.active = true;

    let transfer_accounts = Transfer {
        from: ctx.accounts.seller_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };

   let transfer_context = CpiContext::new(
    ctx.accounts.token_program.key(),
    transfer_accounts,
);

    token::transfer(transfer_context, 1)?;

    Ok(())
}