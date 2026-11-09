"use client";

import axios from "axios";
import { useState } from "react";
import {
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";

import { useCancelListingOnChain } from "@/hooks/use-cancel-listing-on-chain";
import { useCancelNFTListing } from "@/hooks/use-cancel-nft-listing";
import type { CollectedNFT } from "@/services/user";
import { getProfileErrorMessage } from "@/services/user";

interface CancelListingModalProps {
  nft: Omit<CollectedNFT, "mintAddress"> & { mintAddress: string };
  onClose: () => void;
  onSuccess: (signature: string) => void;
}

export default function CancelListingModal({
  nft,
  onClose,
  onSuccess,
}: CancelListingModalProps) {
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSavingBackend, setIsSavingBackend] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState("");

  const { cancelListing } = useCancelListingOnChain();
  const cancelListingMutation = useCancelNFTListing();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Keep the current signature locally to avoid stale React state.
    let signature = transactionSignature;

    try {
      setIsCancelling(true);

      // Step 1: Cancel on-chain only if no transaction exists yet.
      if (!signature) {
        signature = await cancelListing(nft.mintAddress);
        setTransactionSignature(signature);
      }

      // Step 2: Save the confirmed cancellation in the backend.
      setIsSavingBackend(true);

      await cancelListingMutation.mutateAsync({
        nftId: nft.id,
        transactionSignature: signature,
      });

      // Step 3: Notify the parent after the backend succeeds.
      onSuccess(signature);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? getProfileErrorMessage(err)
        : err instanceof Error
          ? err.message
          : "Something went wrong while cancelling your listing.";

      setError(
        signature
          ? `${message} Your on-chain cancellation is already confirmed. Retry saving it without submitting another transaction.`
          : message,
      );
    } finally {
      setIsCancelling(false);
      setIsSavingBackend(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-[#01040c]/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isCancelling) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-listing-title"
        className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-red-500/20 bg-[#050b18] shadow-[0_0_80px_rgba(239,68,68,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <FaTrashAlt />
            </div>

            <div>
              <h2
                id="cancel-listing-title"
                className="text-lg font-bold text-white"
              >
                Cancel NFT Listing
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Remove this NFT from the marketplace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            aria-label="Close cancellation modal"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <img
              src={nft.image}
              alt={nft.name}
              className="h-16 w-16 rounded-lg object-cover"
            />

            <div className="min-w-0">
              <p className="text-xs text-slate-400">
                {nft.collection?.name ?? "Uncategorized"}
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-white">
                {nft.name}
              </p>

              {nft.listing && (
                <p className="mt-1 text-xs text-slate-400">
                  Listed for {nft.listing.price} {nft.listing.currency}
                </p>
              )}
            </div>
          </div>

          {transactionSignature && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
              <p className="text-xs font-semibold text-emerald-400">
                On-chain cancellation confirmed
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

          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3">
            <p className="text-xs leading-5 text-slate-400">
              {transactionSignature
                ? "Your cancellation is already confirmed on Solana. Retry to update the marketplace database."
                : "Your wallet will ask you to approve this transaction. The NFT will be returned to your wallet, and its marketplace listing will be closed."}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isCancelling}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
            >
              Keep Listing
            </button>

            <button
              type="submit"
              disabled={isCancelling}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isSavingBackend
                    ? "Saving Cancellation..."
                    : transactionSignature
                      ? "Retrying..."
                      : "Confirm in Wallet..."}
                </>
              ) : (
                <>
                  <FaTrashAlt />
                  {transactionSignature
                    ? "Retry Saving Cancellation"
                    : "Confirm Cancellation"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
