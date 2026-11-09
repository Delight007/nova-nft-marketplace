import { PublicKey } from "@solana/web3.js";

export const MARKETPLACE_PROGRAM_ID = new PublicKey(
  "2xUScUbtGaJkpS2xsLrAzGTm9EpjV7U7CumTVeYcYf59",
);

export const MARKETPLACE_SEEDS = {
  marketplace: Buffer.from("marketplace"),
  listing: Buffer.from("listing"),
  escrow: Buffer.from("escrow"),
} as const;
