use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The marketplace fee cannot exceed 10,000 basis points")]
    InvalidMarketplaceFee,

    #[msg("The listing price must be greater than zero")]
    InvalidPrice,

    #[msg("The mint must represent a classic NFT with zero decimals and a supply of one")]
    InvalidNft,

    #[msg("The listing is not active")]
    ListingInactive,
    
    #[msg("The seller cannot buy their own NFT")]
    SellerCannotBuyOwnNft,
    
    #[msg("An arithmetic operation overflowed")]
    ArithmeticOverflow,
}