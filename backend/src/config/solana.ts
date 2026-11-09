import { Connection } from "@solana/web3.js";

const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

export const solanaConnection = new Connection(
  SOLANA_RPC_URL,
  "confirmed",
);
