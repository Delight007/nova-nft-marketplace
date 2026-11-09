"use client";

import type { CollectedNFT } from "@/services/user";
import Link from "next/link";
import { useState } from "react";
import {
  FaCheck,
  FaExternalLinkAlt,
  FaHeart,
  FaSpinner,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";

import ListNFTModal from "@/components/profile/listNFTModal";
import { useListNFTOnChain } from "@/hooks/use-list-nft-on-chain";
import CancelListingModal from "./cancelListingModal";

interface ProfileNftCardProps {
  nft: CollectedNFT;
  view?: "grid" | "list";
  canList?: boolean;
  canCancel?: boolean;
}

export default function ProfileNftCard({
  nft,
  view = "grid",
  canList = false,
  canCancel = false,
}: ProfileNftCardProps) {
  const [liked, setLiked] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCheckingListing, setIsCheckingListing] = useState(false);
  const [listingCheckError, setListingCheckError] = useState("");

  const collectionName = nft.collection?.name ?? "Uncategorized";
  const listing = nft.listing;
  const { hasActiveListing } = useListNFTOnChain();
  const nftHref = nft.mintAddress
    ? `/nft/${encodeURIComponent(nft.mintAddress)}`
    : null;

  const handleManageListing = async () => {
    if (!nft.mintAddress) {
      return;
    }

    setListingCheckError("");
    setIsCheckingListing(true);

    try {
      if (await hasActiveListing(nft.mintAddress)) {
        setShowCancelModal(true);
      } else {
        setShowListingModal(true);
      }
    } catch (error) {
      setListingCheckError(
        error instanceof Error
          ? error.message
          : "Could not check the on-chain listing.",
      );
    } finally {
      setIsCheckingListing(false);
    }
  };

  const handleListingSuccess = (signature: string) => {
    setTransactionSignature(signature);
    setShowListingModal(false);
  };

  return (
    <>
      <article
        className={`group overflow-hidden rounded-2xl border border-blue-500/15 bg-[#031126] transition duration-300 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] ${
          view === "list" ? "flex flex-col sm:flex-row" : ""
        }`}
      >
        {nftHref ? (
          <Link
            href={nftHref}
            className={`relative block overflow-hidden ${
              view === "list"
                ? "aspect-square w-full shrink-0 sm:w-48"
                : "aspect-[1.25/1] w-full"
            }`}
          >
            <img
              src={nft.image}
              alt={nft.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            {nft.collection?.verified && (
              <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-black shadow-lg">
                <FaCheck />
              </span>
            )}
          </Link>
        ) : (
          <div
            className={`relative block overflow-hidden ${
              view === "list"
                ? "aspect-square w-full shrink-0 sm:w-48"
                : "aspect-[1.25/1] w-full"
            }`}
          >
            <img
              src={nft.image}
              alt={nft.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            {nft.collection?.verified && (
              <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-black shadow-lg">
                <FaCheck />
              </span>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-400">
                {collectionName}
              </p>

              {nftHref ? (
                <Link
                  href={nftHref}
                  className="mt-1 block truncate text-sm font-semibold text-white transition hover:text-purple-300"
                >
                  {nft.name}
                </Link>
              ) : (
                <span className="mt-1 block truncate text-sm font-semibold text-white">
                  {nft.name}
                </span>
              )}
            </div>

            <button
              type="button"
              aria-label={liked ? "Unlike NFT" : "Like NFT"}
              aria-pressed={liked}
              onClick={() => setLiked((previous) => !previous)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
            >
              <FaHeart className={liked ? "text-pink-500" : "text-slate-400"} />
            </button>
          </div>

          {nft.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
              {nft.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] text-slate-500">
                {listing ? "Listed for" : "Current status"}
              </p>

              {listing ? (
                <div className="flex items-center gap-2">
                  {listing.currency.toUpperCase() === "SOL" && (
                    <SiSolana
                      aria-hidden="true"
                      className="h-4 w-4 text-[#14F195]"
                    />
                  )}

                  <span className="text-sm font-semibold text-white">
                    {listing.price} {listing.currency}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-slate-400">
                  Not listed
                </span>
              )}
            </div>

            <span
              className="max-w-[140px] truncate text-[10px] text-blue-400"
              title={nft.mintAddress ?? "Mint address unavailable"}
            >
              {nft.mintAddress
                ? `${nft.mintAddress.slice(0, 4)}...${nft.mintAddress.slice(-4)}`
                : "Mint address unavailable"}
            </span>
          </div>

          {canList && nft.mintAddress && (
            <button
              type="button"
              onClick={handleManageListing}
              disabled={isCheckingListing}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {isCheckingListing ? <FaSpinner className="animate-spin" /> : <FaTag />}
              {isCheckingListing ? "Checking Listing..." : "Manage Sale"}
            </button>
          )}

          {listingCheckError && (
            <p role="alert" className="mt-2 text-xs text-red-300">
              {listingCheckError}
            </p>
          )}

          {canCancel && nft.mintAddress && listing && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="mt-4 flex w-full items-center justify-center cursor-pointer gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              <FaTimes />
              Cancel Listing
            </button>
          )}

          {transactionSignature && (
            <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-emerald-400">
                  On-chain transaction confirmed
                </p>

                <button
                  type="button"
                  onClick={() => setTransactionSignature("")}
                  aria-label="Dismiss transaction message"
                  className="text-slate-500 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <a
                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300"
              >
                View on Solscan Explorer
                <FaExternalLinkAlt />
              </a>
            </div>
          )}
        </div>
      </article>

      {showListingModal && nft.mintAddress && (
        <ListNFTModal
          nft={{ ...nft, mintAddress: nft.mintAddress }}
          onClose={() => setShowListingModal(false)}
          onSuccess={handleListingSuccess}
        />
      )}

      {showCancelModal && nft.mintAddress && (
        <CancelListingModal
          nft={{ ...nft, mintAddress: nft.mintAddress }}
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => setShowCancelModal(false)}
        />
      )}
    </>
  );
}
