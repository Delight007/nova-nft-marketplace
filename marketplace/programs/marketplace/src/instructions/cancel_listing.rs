use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, CloseAccount, Mint, Token, TokenAccount, Transfer,
};
use crate::constants::{ESCROW_SEED, LISTING_SEED};
use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(
        seeds = [crate::constants::MARKETPLACE_SEED],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(
        mut,
        close = seller,
        seeds = [
            LISTING_SEED,
            marketplace.key().as_ref(),
            mint.key().as_ref()
        ],
        bump = listing.bump,
        has_one = marketplace,
        has_one = seller,
        has_one = mint
    )]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub mint: Account<'info, Mint>,

    // same escrow token account that was created when the NFT was listed.
        #[account(
        mut,
        seeds = [ESCROW_SEED, listing.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = listing,
        token::token_program = token_program
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    // account to recieve back the nft
        #[account(
        mut,
        constraint = seller_token_account.mint == mint.key(),
        constraint = seller_token_account.owner == seller.key()
    )]

      pub seller_token_account: Account<'info, TokenAccount>,
      pub token_program: Program<'info, Token>,

}

pub fn handle_cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
    let listing = &ctx.accounts.listing;

    require!(
        listing.active,
        crate::error::ErrorCode::ListingInactive
    );

        let marketplace_key = ctx.accounts.marketplace.key();
    let mint_key = ctx.accounts.mint.key();
    let bump = [ctx.accounts.listing.bump];

    let listing_seeds: &[&[u8]] = &[
        LISTING_SEED,
        marketplace_key.as_ref(),
        mint_key.as_ref(),
        &bump,
    ];

    let signer_seeds = &[listing_seeds];

        let transfer_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.seller_token_account.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };

        let transfer_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(),
        transfer_accounts,
        signer_seeds,
    );

    token::transfer(transfer_context, 1)?;

    
    // Close the now-empty escrow token account through the SPL Token program.
    // The listing PDA signs because it is the escrow account's authority.
    let close_accounts = CloseAccount {
        account: ctx.accounts.escrow_token_account.to_account_info(),
        destination: ctx.accounts.seller.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };

    let close_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(),
        close_accounts,
        signer_seeds,
    );

    token::close_account(close_context)?;

     ctx.accounts.listing.active = false;

    Ok(())
}
