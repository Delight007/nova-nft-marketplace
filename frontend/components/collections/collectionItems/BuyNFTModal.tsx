"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaExclamationCircle,
  FaShoppingBag,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";

import {
  clearPendingPurchase,
  getPendingPurchase,
  savePendingPurchase,
} from "@/lib/pending-purchase";

import { useBuyNFT } from "@/hooks/use-buy-nft";
import { useBuyNFTOnChain } from "@/hooks/use-buy-nft-on-chain";
import {
  CURRENT_USER_QUERY_KEY,
  useCurrentUser,
} from "@/hooks/use-current-user";
import { authenticateWalletSession } from "@/lib/auth";
import type { NFTItem } from "./collectionItemsData";

interface BuyNFTModalProps {
  nft: Pick<NFTItem, "id" | "name" | "image" | "collection" | "price"> & {
    mintAddress?: string | null;
  };
  collectionSlug: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuyNFTModal({
  nft,
  collectionSlug,
  onClose,
  onSuccess,
}: BuyNFTModalProps) {
  const [error, setError] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [isSavingBackend, setIsSavingBackend] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationRequired, setAuthenticationRequired] = useState(false);
  const [walletAuthenticated, setWalletAuthenticated] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState("");

  const [transactionWallet, setTransactionWallet] = useState("");

  const { connected, publicKey, signMessage } = useWallet();

  const buyerWallet = publicKey?.toBase58() ?? "";

  const queryClient = useQueryClient();
  const {
    data: currentUser,
    isPending: isCheckingWalletSession,
  } = useCurrentUser(connected && Boolean(buyerWallet));
  const isWalletVerified =
    connected && currentUser?.wallet === buyerWallet;
  const { buyNFT } = useBuyNFTOnChain();
  const completePurchase = useBuyNFT();

  useEffect(() => {
    if (!buyerWallet) {
      setTransactionSignature("");
      setTransactionWallet("");
      return;
    }

    const pendingPurchase = getPendingPurchase(nft.id, buyerWallet);

    setTransactionSignature(pendingPurchase?.transactionSignature ?? "");

    setTransactionWallet(pendingPurchase ? buyerWallet : "");
  }, [nft.id, buyerWallet]);

  const handleAuthenticate = async () => {
    if (!connected || !publicKey || !signMessage) {
      setError(
        "Connect a wallet that supports message signing to authenticate and save this purchase.",
      );
      return;
    }

    setIsAuthenticating(true);
    setError("");

    try {
      const user = await authenticateWalletSession(
        publicKey.toBase58(),
        signMessage,
      );
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      setAuthenticationRequired(false);
      setWalletAuthenticated(true);
    } catch (authError) {
      setWalletAuthenticated(false);
      setError(
        axios.isAxiosError(authError)
          ? authError.response?.data?.message || authError.message
          : authError instanceof Error
            ? authError.message
            : "Wallet authentication failed.",
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // const handlePurchase = async () => {
  //   setError("");
  //   setAuthenticationRequired(false);
  //   setWalletAuthenticated(false);

  //   let signature = transactionSignature;

  //   try {
  //     setIsBuying(true);

  //     // Execute the blockchain purchase only once.
  //     if (!signature) {
  //       if (!nft.mintAddress) {
  //         setError("NFT mint address is missing. Please refresh and try again.");
  //         return;
  //       }

  //       if (nft.price === null || nft.price <= 0) {
  //         setError("This NFT does not have a valid listing price.");
  //         return;
  //       }

  //       signature = await buyNFT(nft.mintAddress);
  //       setTransactionSignature(signature);
  //     }

  //     // Save the already-confirmed transaction to the backend.
  //     setIsSavingBackend(true);

  //     await completePurchase.mutateAsync({
  //       nftId: nft.id,
  //       transactionSignature: signature,
  //       collectionSlug,
  //     });

  //     onSuccess();
  //   } catch (err) {
  //     const message = axios.isAxiosError(err)
  //       ? err.response?.data?.message || err.message
  //       : err instanceof Error
  //         ? err.message
  //         : "Something went wrong while purchasing this NFT.";

  //     const requiresAuth =
  //       axios.isAxiosError(err) && err.response?.status === 401;
  //     setAuthenticationRequired(requiresAuth);
  //     setError(
  //       signature && !requiresAuth
  //         ? `${message} Your on-chain purchase is already confirmed. Retry saving it without submitting another purchase.`
  //         : message,
  //     );
  //   } finally {
  //     setIsBuying(false);
  //     setIsSavingBackend(false);
  //   }
  // };

  const handlePurchase = async () => {
    setError("");
    setAuthenticationRequired(false);
    setWalletAuthenticated(false);

    if (!connected || !buyerWallet) {
      setError("Connect your wallet before continuing.");
      return;
    }

    if (!isWalletVerified) {
      setAuthenticationRequired(true);
      setError("Verify your wallet before continuing with a purchase.");
      return;
    }

    let signature = transactionSignature;

    if (signature && transactionWallet !== buyerWallet) {
      setError(
        "This pending purchase belongs to a different wallet. Reconnect the original buyer wallet.",
      );
      return;
    }

    try {
      setIsBuying(true);

      // Execute the blockchain purchase only once.
      if (!signature) {
        if (!nft.mintAddress) {
          setError(
            "NFT mint address is missing. Please refresh and try again.",
          );
          return;
        }

        if (nft.price === null || nft.price <= 0) {
          setError("This NFT does not have a valid listing price.");
          return;
        }

        signature = await buyNFT(nft.mintAddress);

        // Update React state immediately.
        setTransactionSignature(signature);
        setTransactionWallet(buyerWallet);

        // Persist the confirmed transaction for recovery.
        savePendingPurchase({
          nftId: nft.id,
          buyerWallet,
          transactionSignature: signature,
          createdAt: new Date().toISOString(),
        });
      }

      // Save the already-confirmed transaction to the backend.
      setIsSavingBackend(true);

      await completePurchase.mutateAsync({
        nftId: nft.id,
        transactionSignature: signature,
        collectionSlug,
      });

      // Remove the pending record only after backend success.
      clearPendingPurchase(nft.id, buyerWallet, signature);

      setTransactionSignature("");
      setTransactionWallet("");

      onSuccess();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "Something went wrong while purchasing this NFT.";

      const requiresAuth =
        axios.isAxiosError(err) && err.response?.status === 401;

      setAuthenticationRequired(requiresAuth);

      setError(
        signature && !requiresAuth
          ? `${message} Your on-chain purchase is already confirmed. Retry saving it without submitting another purchase.`
          : message,
      );
    } finally {
      setIsBuying(false);
      setIsSavingBackend(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-[#01040c]/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isBuying &&
          !isAuthenticating
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="buy-nft-title"
        className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/20 bg-[#050b18] shadow-[0_0_80px_rgba(79,70,229,0.15)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <FaShoppingBag />
            </div>

            <div>
              <h2 id="buy-nft-title" className="text-lg font-bold text-white">
                Buy NFT
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Review your purchase before confirming.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBuying || isAuthenticating}
            aria-label="Close purchase modal"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <img
              src={nft.image}
              alt={nft.name}
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400">{nft.collection}</p>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {nft.name}
              </p>
              {nft.mintAddress && (
                <p className="mt-1 text-[11px] text-slate-500">
                  {nft.mintAddress.slice(0, 6)}...
                  {nft.mintAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-[#080e1d] p-4">
            <p className="text-xs text-slate-400">Purchase price</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SiSolana className="text-xl text-[#14F195]" />
                <span className="text-xl font-bold text-white">
                  {nft.price?.toFixed(4) ?? "—"} SOL
                </span>
              </div>
              <span className="text-xs text-slate-500">SOL</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Your wallet may also require a small network transaction fee.
            </p>
          </div>

          {transactionSignature && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
              <p className="text-xs font-semibold text-emerald-400">
                On-chain purchase confirmed
              </p>
              <p className="mt-1 break-all text-[11px] text-slate-400">
                {transactionSignature}
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-3 text-xs leading-5 text-red-300"
            >
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {connected &&
            (authenticationRequired ||
              (buyerWallet &&
                !isCheckingWalletSession &&
                !isWalletVerified)) && (
              <button
                type="button"
                onClick={handleAuthenticate}
                disabled={isAuthenticating || isBuying}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAuthenticating && <FaSpinner className="animate-spin" />}
                {isAuthenticating ? "Verifying Wallet..." : "Verify Wallet"}
              </button>
            )}

          {walletAuthenticated && transactionSignature && (
            <p className="text-center text-xs text-emerald-400">
              Wallet verified. Retry saving the confirmed purchase.
            </p>
          )}

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
            <p className="text-xs leading-5 text-slate-400">
              {transactionSignature
                ? "Your purchase is already confirmed on Solana. Retry to save the sale to the marketplace database."
                : "When you continue, your wallet will request approval. Once confirmed, the NFT will be transferred to your wallet and the seller will receive payment."}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isBuying || isAuthenticating}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePurchase}
              disabled={
                isBuying ||
                isAuthenticating ||
                isCheckingWalletSession ||
                !connected ||
                !buyerWallet ||
                !isWalletVerified ||
                (!transactionSignature && !nft.mintAddress)
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBuying ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isSavingBackend
                    ? "Saving Purchase..."
                    : transactionSignature
                      ? "Retrying..."
                      : "Processing Transaction..."}
                </>
              ) : (
                <>
                  <FaShoppingBag />
                  {transactionSignature ? "Retry Saving Purchase" : "Buy Now"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
