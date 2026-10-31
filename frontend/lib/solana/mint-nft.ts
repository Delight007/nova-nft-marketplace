import {
  generateSigner,
  percentAmount,
  type Umi,
} from "@metaplex-foundation/umi";

import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

export interface MintNFTInput {
  name: string;
  description: string;
  image: string;
  royalty: number;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface MintNFTResult {
  mintAddress: string;
  metadataUri: string;
  transactionSignature: string;
}

export async function mintNFT(
  umi: Umi,
  input: MintNFTInput,
): Promise<MintNFTResult> {
  if (!input.name.trim()) {
    throw new Error("NFT name is required.");
  }

  if (!input.image.startsWith("https://")) {
    throw new Error("A valid HTTPS artwork URL is required.");
  }

  if (
    !Number.isFinite(input.royalty) ||
    input.royalty < 0 ||
    input.royalty > 100
  ) {
    throw new Error("Royalty must be between 0 and 100.");
  }

  const metadata = {
    name: input.name.trim(),
    description: input.description.trim(),
    image: input.image,
    attributes: input.attributes,
  };

  // Upload NFT metadata to Irys.
  const metadataUri = await umi.uploader.uploadJson(metadata);

  // Generate a new NFT mint account.
  const mint = generateSigner(umi);

  // Create the NFT on Solana.
  const transaction = await createNft(umi, {
    mint,
    name: input.name.trim(),
    symbol: "NOVA",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(input.royalty),
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
    isMutable: true,
  }).sendAndConfirm(umi);

  return {
    mintAddress: mint.publicKey.toString(),
    metadataUri,
    transactionSignature: bs58.encode(transaction.signature),
  };
}
