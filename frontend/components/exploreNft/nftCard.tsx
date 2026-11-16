"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight, FiCheck, FiClock, FiHeart } from "react-icons/fi";
import type { MarketplaceNFT } from "@/services/marketplace";
import type { MarketplaceView } from "./MarketplaceFilters";

type NFTCardProps = {
  nft: MarketplaceNFT;
  view: MarketplaceView;
};

function formatListedDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleDateString();
}

export default function NFTCard({ nft, view }: NFTCardProps) {
  const [liked, setLiked] = useState(false);
  const price = nft.listing
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(
        nft.listing.price,
      )
    : null;
  const nftHref = `/nft/${encodeURIComponent(nft.mintAddress ?? nft.id)}`;
  const listedAt = nft.listing?.listedAt ?? nft.createdAt;

  return (
    <article
      className={`group overflow-hidden rounded-[14px] border border-[#172640] bg-[#050b17] p-[3px] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/50 hover:shadow-[0_12px_35px_rgba(139,92,246,0.12)] ${
        view === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <Link
        href={nftHref}
        aria-label={`View ${nft.name}`}
        className={`relative block overflow-hidden rounded-[11px] bg-[#0b1326] ${
          view === "list"
            ? "aspect-[16/10] w-full shrink-0 sm:aspect-square sm:w-48"
            : "aspect-[16/10] w-full"
        }`}
      >
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {nft.listing && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-emerald-300/20 bg-emerald-950/80 px-2.5 py-1 text-[10px] font-medium text-emerald-200">
            Listed
          </span>
        )}
        <button
          type="button"
          aria-label={liked ? `Unlike ${nft.name}` : `Like ${nft.name}`}
          aria-pressed={liked}
          onClick={(event) => {
            event.preventDefault();
            setLiked((current) => !current);
          }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#071020]/75 backdrop-blur-md transition ${
            liked
              ? "text-pink-400"
              : "text-white hover:border-purple-400 hover:bg-purple-600"
          }`}
        >
          <FiHeart className={liked ? "fill-current" : ""} />
        </button>
      </Link>

      <div
        className={`min-w-0 flex-1 px-[10px] pb-[9px] pt-[9px] ${
          view === "list" ? "flex flex-col justify-center sm:px-5" : ""
        }`}
      >
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative h-[25px] w-[25px] shrink-0 overflow-hidden rounded-full border border-purple-400/40 bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-[1px]">
              <img
                src={nft.collection?.image ?? nft.image}
                alt=""
                loading="lazy"
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <span className="truncate text-[11px] font-medium tracking-wide text-slate-300">
              {nft.collection?.name ?? "Uncategorized"}
            </span>
            {nft.collection?.verified && (
              <span
                className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
                aria-label="Verified collection"
                title="Verified collection"
              >
                <FiCheck className="h-[9px] w-[9px] stroke-[3]" />
              </span>
            )}
          </div>
          <Link
            href={nftHref}
            className="flex shrink-0 items-center justify-center rounded-full border border-purple-500/20 bg-[#241344] px-[11px] py-[5px] text-[10px] font-medium text-purple-300 transition hover:border-purple-400/60 hover:bg-purple-600 hover:text-white"
          >
            {nft.listing ? "Buy Now" : "View NFT"}
            <FiArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>

        <Link
          href={nftHref}
          className="mt-1 block truncate text-[13px] font-semibold leading-5 tracking-tight text-white hover:text-cyan-200"
        >
          {nft.name}
        </Link>
        {view === "list" && nft.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">
            {nft.description}
          </p>
        )}

        <div className="mt-[9px] flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-100">
            {price !== null ? `${price} ${nft.listing?.currency ?? "SOL"}` : "Not listed"}
          </span>
        </div>

        <div className="mt-[12px] flex items-center justify-between border-t border-white/[0.045] pt-[9px]">
          <span className="flex items-center gap-[5px] text-[10px] text-slate-500">
            <FiClock className="h-[11px] w-[11px]" />
            {nft.listing ? "Listed" : "Created"} {formatListedDate(listedAt)}
          </span>
          {nft.mintAddress && (
            <span className="text-[10px] text-slate-600">
              {nft.mintAddress.slice(0, 4)}…{nft.mintAddress.slice(-4)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
