"use client";

import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { useMarketplaceProgram } from "@/lib/solana/anchor";
import {
  getEscrowPda,
  getListingPda,
  getMarketplacePda,
} from "@/lib/solana/pdas";

export function useCancelListingOnChain() {
  const { program, publicKey, connected } = useMarketplaceProgram();

  async function cancelListing(mintAddress: string) {
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

    const sellerTokenAccount = await getAssociatedTokenAddress(mint, publicKey);

    const transactionSignature = await program.methods
      .cancelListing()
      .accountsStrict({
        marketplace: marketplacePda,
        listing: listingPda,
        seller: publicKey,
        mint,
        escrowTokenAccount: escrowPda,
        sellerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return transactionSignature;
  }

  return { cancelListing };
}
