"use client";

import {
  CURRENT_USER_QUERY_KEY,
  useCurrentUser,
} from "@/hooks/use-current-user";
import { authenticateWalletSession } from "@/lib/auth";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let bodyScrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  onVerified: () => void;
};

export default function WalletVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: Props) {
  const { publicKey, connected, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const queryClient = useQueryClient();
  const walletAddress = publicKey?.toBase58();
  const { data: currentUser, isPending: isCheckingSession } = useCurrentUser(
    connected && Boolean(walletAddress),
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    if (bodyScrollLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousDocumentOverflow = document.documentElement.style.overflow;
    }

    bodyScrollLockCount += 1;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      bodyScrollLockCount -= 1;

      if (bodyScrollLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousDocumentOverflow;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      completedRef.current = false;
      return;
    }

    if (
      !completedRef.current &&
      walletAddress &&
      currentUser?.wallet === walletAddress
    ) {
      completedRef.current = true;
      onVerified();
    }
  }, [currentUser?.wallet, isOpen, onVerified, walletAddress]);

  if (!isOpen) return null;

  async function verifyWallet() {
    if (!walletAddress || !signMessage) {
      setError(
        "Connect a wallet that supports message signing to verify ownership.",
      );
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      const user = await authenticateWalletSession(walletAddress, signMessage);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      completedRef.current = true;
      onVerified();
    } catch (verificationError) {
      setError(
        axios.isAxiosError<{ message?: string }>(verificationError)
          ? (verificationError.response?.data?.message ??
            verificationError.message)
          : verificationError instanceof Error
            ? verificationError.message
            : "Wallet verification failed.",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1030] flex items-center justify-center bg-[#01040c]/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-verification-title"
        className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#050b18] p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wallet verification"
            className="float-right rounded-lg px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        )}

        <h2
          id="wallet-verification-title"
          className="text-xl font-semibold text-white"
        >
          {connected ? "Verify your wallet" : "Connect your wallet"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {connected
            ? "Sign a one-time message to prove that you own this wallet. This does not submit a blockchain transaction."
            : "Connect a Solana wallet to continue. You can browse the marketplace without connecting."}
        </p>

        {connected && isCheckingSession && (
          <p className="mt-4 text-sm text-cyan-200" role="status">
            Checking wallet verification...
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={isVerifying || (connected && isCheckingSession)}
          onClick={() => {
            if (connected) {
              void verifyWallet();
            } else {
              setVisible(true);
            }
          }}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVerifying
            ? "Verifying wallet..."
            : connected
              ? "Verify wallet"
              : "Connect wallet"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
