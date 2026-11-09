"use client";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

import { useMarketplaceProgram } from "@/lib/solana/anchor";
import {
  getEscrowPda,
  getListingPda,
  getMarketplacePda,
} from "@/lib/solana/pdas";

export function useBuyNFTOnChain() {
  const { program, publicKey, connected } = useMarketplaceProgram();

  async function buyNFT(mintAddress: string) {
    if (!connected || !publicKey) {
      throw new Error("Connect your wallet first.");
    }

    if (!program) {
      throw new Error("Marketplace program is not available.");
    }

    const mint = new PublicKey(mintAddress);

    const { marketplacePda } = getMarketplacePda();
    const { listingPda } = getListingPda(mint);
    const { escrowPda } = getEscrowPda(listingPda);

    // Fetch the listing to get the actual seller.
    const listingAccount =
      await program.account.listing.fetchNullable(listingPda);

    if (!listingAccount) {
      throw new Error(
        `This NFT has no active on-chain listing (listing account ${listingPda.toBase58()}). The marketplace listing may be out of sync; ask the seller to relist the NFT and refresh.`,
      );
    }

    if (!listingAccount.active) {
      throw new Error("This NFT is no longer listed for sale.");
    }

    const seller = listingAccount.seller;

    if (seller.equals(publicKey)) {
      throw new Error("You cannot buy your own NFT.");
    }

    // Fetch the marketplace to get its configured treasury.
    const marketplaceAccount =
      await program.account.marketplace.fetchNullable(marketplacePda);

    if (!marketplaceAccount) {
      throw new Error(
        `The marketplace has not been initialized on this Solana network (marketplace account ${marketplacePda.toBase58()}). Please contact the marketplace administrator.`,
      );
    }

    const treasury = marketplaceAccount.treasury;

    // Derive the buyer's associated token account.
    const buyerTokenAccount = await getAssociatedTokenAddress(mint, publicKey);

    // Create the buyer's token account if it doesn't exist.
    const createBuyerTokenAccount =
      createAssociatedTokenAccountIdempotentInstruction(
        publicKey,
        buyerTokenAccount,
        publicKey,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

    const transactionSignature = await program.methods
      .buyNft()
      .accountsStrict({
        marketplace: marketplacePda,
        listing: listingPda,
        buyer: publicKey,
        seller,
        mint,
        escrowTokenAccount: escrowPda,
        buyerTokenAccount,
        treasury,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions([createBuyerTokenAccount])
      .rpc();

    return transactionSignature;
  }

  return { buyNFT };
}
