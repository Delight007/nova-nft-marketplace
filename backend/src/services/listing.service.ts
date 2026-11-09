import { PublicKey, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { createHash } from "node:crypto";

import {
  MARKETPLACE_PROGRAM_ID,
  MARKETPLACE_SEEDS,
} from "../config/marketplace.js";
import { solanaConnection } from "../config/solana.js";

const LISTING_ACCOUNT_DISCRIMINATOR = createHash("sha256")
  .update("account:Listing")
  .digest()
  .subarray(0, 8);

const LIST_NFT_INSTRUCTION_DISCRIMINATOR = createHash("sha256")
  .update("global:list_nft")
  .digest()
  .subarray(0, 8);

const LAMPORTS_PER_SOL = 1_000_000_000n;

async function deriveMarketplacePda() {
  const [marketplace] = await PublicKey.findProgramAddress(
    [MARKETPLACE_SEEDS.marketplace],
    MARKETPLACE_PROGRAM_ID,
  );

  return marketplace;
}

async function deriveListingPda(mint: PublicKey) {
  const marketplace = await deriveMarketplacePda();

  const [listing] = await PublicKey.findProgramAddress(
    [MARKETPLACE_SEEDS.listing, marketplace.toBytes(), mint.toBytes()],
    MARKETPLACE_PROGRAM_ID,
  );

  return listing;
}

function decodeListingAccount(data: Buffer) {
  if (data.length < 114) {
    throw new Error("Invalid listing account data");
  }

  const discriminator = data.subarray(0, 8);

  if (!discriminator.equals(LISTING_ACCOUNT_DISCRIMINATOR)) {
    throw new Error("Invalid listing account discriminator");
  }

  let offset = 8;

  const marketplace = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;

  const seller = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;

  const mint = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;

  const price = data.readBigUInt64LE(offset);
  offset += 8;

  const bump = data.readUInt8(offset);
  offset += 1;

  const active = data.readUInt8(offset) === 1;

  return { marketplace, seller, mint, price, bump, active };
}

function lamportsToSol(price: bigint): string {
  const whole = price / LAMPORTS_PER_SOL;
  const fraction = (price % LAMPORTS_PER_SOL).toString().padStart(9, "0");

  return `${whole}.${fraction}`;
}

type VerifyListingInput = {
  transactionSignature: string;
  sellerWallet: string;
  mintAddress: string;
};

export async function verifyListingTransaction({
  transactionSignature,
  sellerWallet,
  mintAddress,
}: VerifyListingInput) {
  const seller = new PublicKey(sellerWallet);
  const mint = new PublicKey(mintAddress);

  const transaction = await solanaConnection.getParsedTransaction(
    transactionSignature,
    {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    },
  );

  if (!transaction) {
    throw new Error("Listing transaction not found or not confirmed");
  }

  if (transaction.meta?.err) {
    throw new Error("Listing transaction failed");
  }

  const expectedMarketplace = await deriveMarketplacePda();
  const expectedListing = await deriveListingPda(mint);

  const listingInstruction = transaction.transaction.message.instructions.find(
    (instruction) =>
      "accounts" in instruction &&
      instruction.programId.equals(MARKETPLACE_PROGRAM_ID),
  );

  if (!listingInstruction || !("accounts" in listingInstruction)) {
    throw new Error("Marketplace instruction not found");
  }

  const instructionData = Buffer.from(bs58.decode(listingInstruction.data));

  if (
    instructionData.length !== 16 ||
    !instructionData.subarray(0, 8).equals(LIST_NFT_INSTRUCTION_DISCRIMINATOR)
  ) {
    throw new Error("Invalid list_nft instruction");
  }

  const instructionPrice = instructionData.readBigUInt64LE(8);
  const accounts = listingInstruction.accounts;

  if (accounts.length < 8) {
    throw new Error("Invalid listing instruction accounts");
  }

  const marketplaceAccount = accounts[0];
  const sellerAccount = accounts[1];
  const mintAccount = accounts[2];
  const listingAccount = accounts[4];

  if (
    !marketplaceAccount ||
    !sellerAccount ||
    !mintAccount ||
    !listingAccount
  ) {
    throw new Error("Invalid listing instruction accounts");
  }

  const sellerIsSigner = transaction.transaction.message.accountKeys.some(
    (account) => account.pubkey.equals(seller) && account.signer,
  );

  if (!sellerIsSigner) {
    throw new Error("Seller did not sign the listing transaction");
  }

  const listingAccountInfo =
    await solanaConnection.getAccountInfo(expectedListing);

  if (!listingAccountInfo) {
    throw new Error("Listing account does not exist");
  }

  if (!listingAccountInfo.owner.equals(MARKETPLACE_PROGRAM_ID)) {
    throw new Error("Listing account has an invalid owner");
  }

  const listing = decodeListingAccount(Buffer.from(listingAccountInfo.data));

  if (
    !listing.marketplace.equals(expectedMarketplace) ||
    !listing.seller.equals(seller) ||
    !listing.mint.equals(mint) ||
    listing.price !== instructionPrice ||
    !listing.active
  ) {
    throw new Error("On-chain listing verification failed");
  }

  return {
    listingAddress: expectedListing.toBase58(),
    seller: listing.seller.toBase58(),
    mint: listing.mint.toBase58(),
    priceLamports: listing.price.toString(),
    priceSol: lamportsToSol(listing.price),
    active: listing.active,
    transactionSignature,
  };
}

const CANCEL_LISTING_INSTRUCTION_DISCRIMINATOR = Buffer.from([
  41, 183, 50, 232, 230, 233, 157, 70,
]);

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

type VerifyCancelListingInput = {
  transactionSignature: string;
  sellerWallet: string;
  mintAddress: string;
};

export async function verifyCancelListingTransaction({
  transactionSignature,
  sellerWallet,
  mintAddress,
}: VerifyCancelListingInput) {
  const seller = new PublicKey(sellerWallet);
  const mint = new PublicKey(mintAddress);

  const transaction = await solanaConnection.getParsedTransaction(
    transactionSignature,
    {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    },
  );

  if (!transaction) {
    throw new Error("Cancellation transaction not found or not confirmed");
  }

  if (transaction.meta?.err) {
    throw new Error("Cancellation transaction failed");
  }

  const marketplace = await deriveMarketplacePda();
  const listing = await deriveListingPda(mint);

  const [escrow] = await PublicKey.findProgramAddress(
    [MARKETPLACE_SEEDS.escrow, listing.toBytes()],
    MARKETPLACE_PROGRAM_ID,
  );

  const instructions = transaction.transaction.message.instructions;

  const cancelInstruction = instructions.find(
    (instruction) =>
      "accounts" in instruction &&
      instruction.programId.equals(MARKETPLACE_PROGRAM_ID) &&
      Buffer.from(bs58.decode(instruction.data))
        .subarray(0, 8)
        .equals(CANCEL_LISTING_INSTRUCTION_DISCRIMINATOR),
  );

  if (!cancelInstruction || !("accounts" in cancelInstruction)) {
    throw new Error("Marketplace cancellation instruction not found");
  }

  const instructionData = Buffer.from(bs58.decode(cancelInstruction.data));

  if (instructionData.length !== 8) {
    throw new Error("Invalid cancellation instruction data");
  }

  const accounts = cancelInstruction.accounts;

  if (accounts.length !== 7) {
    throw new Error("Invalid cancellation instruction accounts");
  }

  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  );

  const [sellerTokenAccount] = await PublicKey.findProgramAddress(
    [seller.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  const expectedAccounts = [
    marketplace,
    listing,
    seller,
    mint,
    escrow,
    sellerTokenAccount,
    TOKEN_PROGRAM_ID,
  ];

  for (let i = 0; i < expectedAccounts.length; i++) {
    const actual = accounts[i];
    const expected = expectedAccounts[i];

    if (!actual || !expected || !actual.equals(expected)) {
      throw new Error("Cancellation instruction account verification failed");
    }
  }

  const sellerIsSigner = transaction.transaction.message.accountKeys.some(
    (account) => account.pubkey.equals(seller) && account.signer,
  );

  if (!sellerIsSigner) {
    throw new Error("Seller did not sign the cancellation transaction");
  }

  return {
    marketplaceAddress: marketplace.toBase58(),
    sellerTokenAccount: sellerTokenAccount.toBase58(),
    listingAddress: listing.toBase58(),
    escrowAddress: escrow.toBase58(),
    seller: seller.toBase58(),
    mint: mint.toBase58(),
    transactionSignature,
  };
}

const BUY_NFT_INSTRUCTION_DISCRIMINATOR = createHash("sha256")
  .update("global:buy_nft")
  .digest()
  .subarray(0, 8);

const MARKETPLACE_ACCOUNT_DISCRIMINATOR = createHash("sha256")
  .update("account:Marketplace")
  .digest()
  .subarray(0, 8);

const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

type VerifyBuyNFTInput = {
  transactionSignature: string;
  buyerWallet: string;
  sellerWallet: string;
  mintAddress: string;
};

export async function verifyBuyNFTTransaction({
  transactionSignature,
  buyerWallet,
  sellerWallet,
  mintAddress,
}: VerifyBuyNFTInput) {
  const buyer = new PublicKey(buyerWallet);
  const seller = new PublicKey(sellerWallet);
  const mint = new PublicKey(mintAddress);

  if (buyer.equals(seller)) {
    throw new Error("Seller cannot buy their own NFT");
  }

  const transaction = await solanaConnection.getParsedTransaction(
    transactionSignature,
    {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    },
  );

  if (!transaction) {
    throw new Error("Purchase transaction not found or not confirmed");
  }

  if (transaction.meta?.err) {
    throw new Error("Purchase transaction failed");
  }

  const marketplace = await deriveMarketplacePda();
  const listing = await deriveListingPda(mint);

  const [escrow] = await PublicKey.findProgramAddress(
    [MARKETPLACE_SEEDS.escrow, listing.toBytes()],
    MARKETPLACE_PROGRAM_ID,
  );

  const [buyerTokenAccount] = await PublicKey.findProgramAddress(
    [buyer.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // Verify the actual on-chain marketplace account and treasury.
  const marketplaceInfo = await solanaConnection.getAccountInfo(
    marketplace,
    "confirmed",
  );

  if (!marketplaceInfo) {
    throw new Error("Marketplace account does not exist");
  }

  if (!marketplaceInfo.owner.equals(MARKETPLACE_PROGRAM_ID)) {
    throw new Error("Invalid marketplace account owner");
  }

  const marketplaceData = Buffer.from(marketplaceInfo.data);

  if (
    marketplaceData.length < 74 ||
    !marketplaceData.subarray(0, 8).equals(MARKETPLACE_ACCOUNT_DISCRIMINATOR)
  ) {
    throw new Error("Invalid marketplace account data");
  }

  // Marketplace layout: discriminator (8), authority (32), treasury (32).
  const treasury = new PublicKey(marketplaceData.subarray(40, 72));

  const instructions = transaction.transaction.message.instructions;

  // The buyer ATA creation instruction may come before buy_nft.
  const buyInstruction = instructions.find(
    (instruction) =>
      "accounts" in instruction &&
      instruction.programId.equals(MARKETPLACE_PROGRAM_ID) &&
      Buffer.from(bs58.decode(instruction.data))
        .subarray(0, 8)
        .equals(BUY_NFT_INSTRUCTION_DISCRIMINATOR),
  );

  if (!buyInstruction || !("accounts" in buyInstruction)) {
    throw new Error("Marketplace purchase instruction not found");
  }

  const instructionData = Buffer.from(bs58.decode(buyInstruction.data));

  if (instructionData.length !== 8) {
    throw new Error("Invalid purchase instruction data");
  }

  const accounts = buyInstruction.accounts;

  if (accounts.length !== 10) {
    throw new Error("Invalid purchase instruction accounts");
  }

  const expectedAccounts = [
    marketplace,
    listing,
    buyer,
    seller,
    mint,
    escrow,
    buyerTokenAccount,
    treasury,
    TOKEN_PROGRAM_ID,
    SystemProgram.programId,
  ];

  for (let i = 0; i < expectedAccounts.length; i++) {
    const actual = accounts[i];
    const expected = expectedAccounts[i];

    if (!actual || !expected || !actual.equals(expected)) {
      throw new Error(
        `Purchase instruction account verification failed at index ${i}`,
      );
    }
  }

  const buyerIsSigner = transaction.transaction.message.accountKeys.some(
    (account) => account.pubkey.equals(buyer) && account.signer,
  );

  if (!buyerIsSigner) {
    throw new Error("Buyer did not sign the purchase transaction");
  }

  return {
    marketplaceAddress: marketplace.toBase58(),
    listingAddress: listing.toBase58(),
    escrowAddress: escrow.toBase58(),
    buyer: buyer.toBase58(),
    seller: seller.toBase58(),
    mint: mint.toBase58(),
    buyerTokenAccount: buyerTokenAccount.toBase58(),
    treasury: treasury.toBase58(),
    transactionSignature,
  };
}
