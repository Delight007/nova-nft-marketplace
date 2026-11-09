"use client";

import type { NFTDetailsData } from "@/services/nfts";
import {
  FiCheckCircle,
  FiEye,
  FiHeart,
  FiMoreHorizontal,
  FiShare2,
  FiTag,
} from "react-icons/fi";
import { SiSolana } from "react-icons/si";

type NFTPurchaseCardProps = {
  nft: NFTDetailsData;
  isOwner: boolean;
  favorite: boolean;
  showMore: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onShowMore: () => void;
  onCloseMore: () => void;
  onAction: (message: string) => void;
  onBuy: () => void;
  onList: () => void;
  onCancelListing: () => void;
};

export default function NFTPurchaseCard({
  nft,
  isOwner,
  favorite,
  showMore,
  onFavorite,
  onShare,
  onShowMore,
  onCloseMore,
  onAction,
  onBuy,
  onList,
  onCancelListing,
}: NFTPurchaseCardProps) {
  const listing = nft.listing;
  const lastSale = nft.sales[0];
  const lastSaleDate = lastSale
    ? new Date(lastSale.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="mt-5 rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-blue-400">
            {listing ? (isOwner ? "Your listing" : "Current Price") : "Sale status"}
          </p>
          {listing ? (
            <div className="mt-1 flex items-center gap-2">
              <SiSolana
                aria-label={listing.currency}
                className="h-7 w-7 text-[#14F195]"
              />
              <span className="text-2xl font-semibold">
                {listing.price} {listing.currency}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-lg font-semibold text-slate-200">
              Not for sale
            </p>
          )}
          {listing && (
            <p className="ml-10 mt-1 text-xs text-slate-500">
              Listed{" "}
              {new Date(listing.listedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#172c4c] bg-[#071226] px-3 py-2.5 text-right">
          <p className="flex items-center justify-end gap-1 text-xs text-blue-400">
            <FiEye /> Last Sale
          </p>
          {lastSale ? (
            <>
              <p className="mt-1 text-sm font-medium">
                {lastSale.price} {lastSale.currency}
              </p>
              <p className="mt-1 text-[11px] text-blue-300">{lastSaleDate}</p>
            </>
          ) : (
            <p className="mt-1 text-sm font-medium text-slate-400">
              No sales yet
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        {listing ? (
          isOwner ? (
            <button
              type="button"
              onClick={onCancelListing}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-3.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/15"
            >
              <FiTag /> Cancel Your Listing
            </button>
          ) : (
            <button
              type="button"
              onClick={onBuy}
              disabled={!nft.mintAddress}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-400 px-3 py-3.5 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTag /> Buy Now
            </button>
          )
        ) : isOwner ? (
          <button
            type="button"
            onClick={onList}
            disabled={!nft.mintAddress}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/70 bg-[#050e20] px-3 py-3.5 text-sm font-semibold transition hover:bg-[#0b1c35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTag />
            {nft.mintAddress ? "List for Sale" : "Mint required to list"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#1b3152] bg-[#050e20] px-3 py-3.5 text-sm font-semibold text-slate-400">
            <FiCheckCircle /> Not available for purchase
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1fr_48px] gap-3">
        <button
          type="button"
          onClick={onFavorite}
          className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-3 text-xs transition ${
            favorite
              ? "border-pink-500/60 bg-pink-500/10 text-pink-300"
              : "border-[#1b3152] text-blue-200 hover:border-pink-500/60"
          }`}
        >
          <FiHeart className={favorite ? "fill-current" : ""} />
          {favorite ? "Favorited" : "Add to Favorites"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#1b3152] px-2 py-3 text-xs text-blue-200 transition hover:border-cyan-400"
        >
          <FiShare2 /> Share
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={onShowMore}
            aria-label="More NFT actions"
            className="flex h-full w-full items-center justify-center rounded-xl border border-[#1b3152] text-blue-200 hover:border-cyan-400"
          >
            <FiMoreHorizontal size={20} />
          </button>
          {showMore && (
            <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-[#203555] bg-[#09152a] p-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onAction("Report feature coming soon");
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
              >
                Report NFT
              </button>
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  if (nft.mintAddress) {
                    window.open(
                      `https://explorer.solana.com/address/${nft.mintAddress}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } else {
                    onAction("This NFT has not been minted yet.");
                  }
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
              >
                View on explorer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
