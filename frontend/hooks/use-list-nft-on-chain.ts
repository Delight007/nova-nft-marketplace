"use client";

import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

import { useMarketplaceProgram } from "@/lib/solana/anchor";
import {
  getEscrowPda,
  getListingPda,
  getMarketplacePda,
} from "@/lib/solana/pdas";

function solToLamports(price: string): BN {
  const normalized = price.trim();

  if (!/^\d+(\.\d{1,9})?$/.test(normalized)) {
    throw new Error("Enter a valid SOL price with up to 9 decimal places.");
  }

  const [whole, fraction = ""] = normalized.split(".");

  const lamports = new BN(whole)
    .mul(new BN("1000000000"))
    .add(new BN(fraction.padEnd(9, "0")));

  if (lamports.lte(new BN(0))) {
    throw new Error("Listing price must be greater than zero.");
  }

  return lamports;
}

export function useListNFTOnChain() {
  const { program, publicKey, connected } = useMarketplaceProgram();

  async function hasActiveListing(mintAddress: string) {
    if (!connected || !publicKey) {
      throw new Error("Connect your wallet first.");
    }

    if (!program) {
      throw new Error("Marketplace program is not available.");
    }

    const mint = new PublicKey(mintAddress);
    const { listingPda } = getListingPda(mint);
    const existingListing =
      await program.account.listing.fetchNullable(listingPda);

    if (existingListing?.active && !existingListing.seller.equals(publicKey)) {
      throw new Error(
        "This NFT has an active listing owned by another wallet.",
      );
    }

    return Boolean(existingListing?.active);
  }

  async function listNFT(mintAddress: string, price: string) {
    if (!connected || !publicKey) {
      throw new Error("Connect your wallet first.");
    }

    if (!program) {
      throw new Error("Marketplace program is not available.");
    }

    const mint = new PublicKey(mintAddress);
    const priceLamports = solToLamports(price);

    const { marketplacePda } = getMarketplacePda();
    const { listingPda } = getListingPda(mint);
    const { escrowPda } = getEscrowPda(listingPda);

    if (await hasActiveListing(mintAddress)) {
      throw new Error(
        "This NFT already has an active listing. Cancel it before listing it again.",
      );
    }

    const sellerTokenAccount = await getAssociatedTokenAddress(mint, publicKey);

    const transactionSignature = await program.methods
      .listNft(priceLamports)
      .accountsStrict({
        marketplace: marketplacePda,
        seller: publicKey,
        mint,
        sellerTokenAccount,
        listing: listingPda,
        escrowTokenAccount: escrowPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return transactionSignature;
  }

  return { listNFT, hasActiveListing };
}
