import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

import marketplaceIdl from "./idl/marketplace.json";
import type { Marketplace } from "./marketplace";

export function useMarketplaceProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      return null;
    }

    const provider = new AnchorProvider(connection, wallet as any, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    });

    return new Program<Marketplace>(marketplaceIdl as Marketplace, provider);
  }, [connection, wallet]);

  return {
    program,
    publicKey: wallet.publicKey,
    connected: wallet.connected,
  };
}
