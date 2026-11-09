"use client";

import axios from "axios";
import { useState } from "react";
import { FaExclamationCircle, FaSpinner, FaTag, FaTimes } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

import { useCreateNFTListing } from "@/hooks/use-create-nft-listing";
import { useListNFTOnChain } from "@/hooks/use-list-nft-on-chain";
import type { CollectedNFT } from "@/services/user";
import { getProfileErrorMessage } from "@/services/user";

interface ListNFTModalProps {
  nft: Omit<CollectedNFT, "mintAddress"> & { mintAddress: string };
  onClose: () => void;
  onSuccess: (signature: string) => void;
}

export default function ListNFTModal({
  nft,
  onClose,
  onSuccess,
}: ListNFTModalProps) {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [isListing, setIsListing] = useState(false);
  const [isSavingBackend, setIsSavingBackend] = useState(false);

  // Stores the confirmed transaction so we can retry the backend
  // request without submitting another on-chain transaction.
  const [transactionSignature, setTransactionSignature] = useState("");

  const { listNFT } = useListNFTOnChain();
  const createListing = useCreateNFTListing();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Validate the price only before the on-chain transaction.
    if (!transactionSignature && (!price.trim() || Number(price) <= 0)) {
      setError("Enter a valid listing price greater than zero.");
      return;
    }

    try {
      setIsListing(true);

      let signature = transactionSignature;

      // Step 1: Submit the on-chain transaction only once.
      if (!signature) {
        signature = await listNFT(nft.mintAddress, price);
        setTransactionSignature(signature);
      }

      // Step 2: Save the verified transaction in the backend.
      setIsSavingBackend(true);

      await createListing.mutateAsync({
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
          : "Something went wrong while listing your NFT.";

      setError(
        transactionSignature
          ? `${message} Your on-chain transaction is already confirmed. You can retry saving the listing without submitting another transaction.`
          : message,
      );
    } finally {
      setIsListing(false);
      setIsSavingBackend(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-[#01040c]/85 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isListing) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="list-nft-title"
        className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/20 bg-[#050b18] shadow-[0_0_80px_rgba(79,70,229,0.15)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <FaTag />
            </div>

            <div>
              <h2 id="list-nft-title" className="text-lg font-bold text-white">
                List NFT for Sale
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Set your asking price in SOL.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isListing}
            aria-label="Close listing modal"
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
              <p className="mt-1 text-[11px] text-slate-500">
                {nft.mintAddress.slice(0, 6)}...
                {nft.mintAddress.slice(-4)}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="listing-price"
              className="text-sm font-medium text-slate-200"
            >
              Listing Price
            </label>

            <div className="relative mt-2">
              <SiSolana className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#14F195]" />

              <input
                id="listing-price"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                disabled={isListing || Boolean(transactionSignature)}
                className="w-full rounded-xl border border-white/[0.09] bg-[#080e1d] py-3 pl-12 pr-16 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/70 disabled:opacity-50"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                SOL
              </span>
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Enter a price with up to 9 decimal places.
            </p>
          </div>

          {transactionSignature && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
              <p className="text-xs font-semibold text-emerald-400">
                On-chain transaction confirmed
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

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
            <p className="text-xs leading-5 text-slate-400">
              {transactionSignature
                ? "Your transaction is already confirmed. Retry to save the listing to the marketplace database."
                : "When you confirm, your wallet will request approval for the transaction. Your NFT will be transferred into the marketplace escrow account."}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isListing}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isListing || (!transactionSignature && !price.trim())}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isListing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isSavingBackend
                    ? "Saving Listing..."
                    : transactionSignature
                      ? "Retrying..."
                      : "Confirm in Wallet..."}
                </>
              ) : (
                <>
                  <FaTag />
                  {transactionSignature ? "Retry Saving Listing" : "List NFT"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
