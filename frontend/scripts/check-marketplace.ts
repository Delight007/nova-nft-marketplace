import { Connection } from "@solana/web3.js";
import { getMarketplacePda } from "../lib/solana/pdas";

async function main() {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed",
  );

  const { marketplacePda, bump } = getMarketplacePda();

  const accountInfo = await connection.getAccountInfo(marketplacePda);

  console.log("Marketplace PDA:", marketplacePda.toBase58());
  console.log("Bump:", bump);
  console.log("Account exists:", accountInfo !== null);
  console.log("Owner:", accountInfo?.owner.toBase58());
}

main().catch(console.error);
