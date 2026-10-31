use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, CloseAccount, Mint, Token, TokenAccount, Transfer,
};

use crate::constants::{ESCROW_SEED, LISTING_SEED};
use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct BuyNft<'info> {
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
    pub buyer: Signer<'info>,
    

    /// CHECK: The address constraint verifies this account matches listing.seller.
    #[account(
        mut,
        address = listing.seller
    )]
    pub seller: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [
            ESCROW_SEED,
            listing.key().as_ref()
        ],
        bump,
        token::mint = mint,
        token::authority = listing,
        token::token_program = token_program
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = buyer_token_account.mint == mint.key(),
        constraint = buyer_token_account.owner == buyer.key()
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    /// CHECK: validated against marketplace.treasury
    #[account(
        mut,
        address = marketplace.treasury
    )]
    pub treasury: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_buy_nft(ctx: Context<BuyNft>) -> Result<()> {
let listing = &ctx.accounts.listing;
    require!(
        listing.active,
        crate::error::ErrorCode::ListingInactive
    );

    require!(
        ctx.accounts.buyer.key() != listing.seller,
        crate::error::ErrorCode::SellerCannotBuyOwnNft
    );

    let fee = listing
        .price
        .checked_mul(ctx.accounts.marketplace.fee_bps as u64)
        .ok_or(crate::error::ErrorCode::ArithmeticOverflow)?
        / crate::constants::MAX_FEE_BPS as u64;

    let seller_amount = listing
        .price
        .checked_sub(fee)
        .ok_or(crate::error::ErrorCode::ArithmeticOverflow)?;

   
    // Transfer the seller's share of the payment.
    anchor_lang::system_program::transfer(
        CpiContext::new(
                ctx.accounts.system_program.key(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        ),
        seller_amount,
    )?;

    // Transfer the marketplace fee to the treasury.
    if fee > 0 {
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.key(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                },
            ),
            fee,
        )?;
    }

    
    // Sign for the listing PDA so escrow can release the NFT.
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
        to: ctx.accounts.buyer_token_account.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };

    let transfer_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(),
        transfer_accounts,
        signer_seeds,
    );

    token::transfer(transfer_context, 1)?;
     // Mark the listing as sold.
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
    Ok(())


}