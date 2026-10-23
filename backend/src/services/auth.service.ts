import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { randomBytes } from "node:crypto";
import nacl from "tweetnacl";
import { prisma } from "../lib/prisma.js";
const CHALLENGE_EXPIRY_MINUTES = 5;

export async function createWalletChallenge(wallet: string) {
  // Validate the Solana wallet address.
  let publicKey: PublicKey;

  try {
    publicKey = new PublicKey(wallet);
  } catch {
    throw new Error("Invalid Solana wallet address");
  }

  if (!PublicKey.isOnCurve(publicKey.toBytes())) {
    throw new Error("Invalid wallet public key");
  }

  const normalizedWallet = publicKey.toBase58();
  const nonce = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + CHALLENGE_EXPIRY_MINUTES * 60 * 1000);

  const domain = process.env.AUTH_DOMAIN ?? "localhost:3000";

  const message = [
    `${domain} wants you to sign in to NOVA NFT Marketplace.`,
    "",
    "Sign this message to verify wallet ownership. No transaction will be sent.",
    "",
    `Wallet: ${normalizedWallet}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`,
    `Expiration Time: ${expiresAt.toISOString()}`,
  ].join("\n");

  // Invalidate previous challenges for this wallet.
  await prisma.walletChallenge.deleteMany({
    where: { wallet: normalizedWallet },
  });

  const challenge = await prisma.walletChallenge.create({
    data: {
      wallet: normalizedWallet,
      nonce,
      message,
      expiresAt,
    },
  });

  return {
    wallet: challenge.wallet,
    message: challenge.message,
    expiresAt: challenge.expiresAt,
  };
}

export async function verifyWalletSignature(wallet: string, signature: string) {
  let publicKey: PublicKey;

  try {
    publicKey = new PublicKey(wallet);
  } catch {
    throw new Error("Invalid Solana wallet address");
  }

  if (!PublicKey.isOnCurve(publicKey.toBytes())) {
    throw new Error("Invalid wallet public key");
  }

  const normalizedWallet = publicKey.toBase58();

  // Decode the Base58-encoded signature.
  let signatureBytes: Uint8Array;

  try {
    signatureBytes = bs58.decode(signature);
  } catch {
    throw new Error("Invalid signature encoding");
  }

  if (signatureBytes.length !== 64) {
    throw new Error("Invalid signature length");
  }

  // Find the active challenge for this wallet.
  const now = new Date();

  const challenge = await prisma.walletChallenge.findFirst({
    where: {
      wallet: normalizedWallet,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    throw new Error("No active challenge found or challenge expired");
  }

  // Verify the signature against the exact stored message.
  const isValid = nacl.sign.detached.verify(
    new TextEncoder().encode(challenge.message),
    signatureBytes,
    publicKey.toBytes(),
  );

  if (!isValid) {
    throw new Error("Invalid wallet signature");
  }

  // Consume the challenge exactly once.
  const consumed = await prisma.walletChallenge.deleteMany({
    where: {
      id: challenge.id,
      expiresAt: { gt: new Date() },
    },
  });

  if (consumed.count !== 1) {
    throw new Error("Challenge expired or already used");
  }

  // Find an existing user or create a new one.
  const user = await prisma.user.upsert({
    where: { wallet: normalizedWallet },
    update: {},
    create: { wallet: normalizedWallet },
    select: {
      id: true,
      wallet: true,
      username: true,
      avatar: true,
      createdAt: true,
    },
  });

  return user;
}
