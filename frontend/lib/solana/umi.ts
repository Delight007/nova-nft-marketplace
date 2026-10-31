import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi as createUmiInstance } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import type { WalletAdapter } from "@solana/wallet-adapter-base";

const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export function createWalletUmi(walletAdapter: WalletAdapter) {
  return createUmiInstance(SOLANA_RPC_URL)
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(walletAdapter))
    .use(irysUploader({ address: "https://devnet.irys.xyz" }));
}
