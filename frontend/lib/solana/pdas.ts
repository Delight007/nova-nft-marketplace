import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "2xUScUbtGaJkpS2xsLrAzGTm9EpjV7U7CumTVeYcYf59",
);

const MARKETPLACE_SEED = Buffer.from("marketplace");
const LISTING_SEED = Buffer.from("listing");
const ESCROW_SEED = Buffer.from("escrow");

export function getMarketplacePda() {
  const [marketplacePda, bump] = PublicKey.findProgramAddressSync(
    [MARKETPLACE_SEED],
    PROGRAM_ID,
  );

  return { marketplacePda, bump };
}

export function getListingPda(mint: PublicKey) {
  const { marketplacePda } = getMarketplacePda();

  const [listingPda, bump] = PublicKey.findProgramAddressSync(
    [LISTING_SEED, marketplacePda.toBuffer(), mint.toBuffer()],
    PROGRAM_ID,
  );

  return { listingPda, bump };
}

export function getEscrowPda(listing: PublicKey) {
  const [escrowPda, bump] = PublicKey.findProgramAddressSync(
    [ESCROW_SEED, listing.toBuffer()],
    PROGRAM_ID,
  );

  return { escrowPda, bump };
}
