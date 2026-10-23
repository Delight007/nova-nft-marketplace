import type { Request, Response } from "express";
import {
  createWalletChallenge,
  verifyWalletSignature,
} from "../services/auth.service.js";
import {
  createSessionToken,
  sessionDurationSeconds,
} from "../services/session.service.js";

export async function challengeWallet(req: Request, res: Response) {
  const { wallet } = req.body ?? {};

  if (typeof wallet !== "string" || !wallet.trim()) {
    res.status(400).json({
      success: false,
      message: "A wallet address is required",
    });
    return;
  }

  try {
    const challenge = await createWalletChallenge(wallet.trim());

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create challenge";

    const isInvalidWallet =
      message === "Invalid Solana wallet address" ||
      message === "Invalid wallet public key";

    res.status(isInvalidWallet ? 400 : 500).json({
      success: false,
      message: isInvalidWallet ? message : "Unable to create wallet challenge",
    });
  }
}

export async function verifyWallet(req: Request, res: Response) {
  const { wallet, signature } = req.body ?? {};

  if (
    typeof wallet !== "string" ||
    !wallet.trim() ||
    typeof signature !== "string" ||
    !signature.trim()
  ) {
    res.status(400).json({
      success: false,
      message: "Wallet address and signature are required",
    });
    return;
  }

  try {
    const user = await verifyWalletSignature(wallet.trim(), signature.trim());

    const token = createSessionToken({
      userId: user.id,
      wallet: user.wallet,
    });

    res.cookie("nova_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Wallet verified and session created",
      data: { user },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to verify wallet";

    const clientErrors = [
      "Invalid Solana wallet address",
      "Invalid wallet public key",
      "Invalid signature encoding",
      "Invalid signature length",
      "No active challenge found or challenge expired",
      "Invalid wallet signature",
      "Challenge expired or already used",
    ];

    const status = clientErrors.includes(message)
      ? message === "Invalid wallet signature"
        ? 401
        : 400
      : 500;

    res.status(status).json({
      success: false,
      message: status === 500 ? "Unable to verify wallet signature" : message,
    });
  }
}
