"use client";

import {
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiShoppingBag,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { rarityColors } from "./collectionItemsData";
import type { NFTItem } from "./collectionItemsData";

type CollectionItemCardProps = {
  item: NFTItem;
  gridView: boolean;
  isFavorite: boolean;
  usdPrice: (price: number) => string;
  onToggleFavorite: (id: string) => void;
  onBuy?: (item: NFTItem) => void;
  onListForSale?: (item: NFTItem) => void;
  onOpenNFT?: (item: NFTItem) => void;
};

export default function CollectionItemCard({
  item,
  gridView,
  isFavorite,
  usdPrice,
  onToggleFavorite,
  onBuy,
  onListForSale,
  onOpenNFT,
}: CollectionItemCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-xl border border-[#172b45] bg-[#050d1b] transition duration-300 hover:-translate-y-0.5 hover:border-purple-500/50 hover:shadow-[0_8px_35px_rgba(94,50,220,0.10)] ${
        gridView ? "" : "flex items-center gap-4 p-3"
      }`}
    >
      <div
        onClick={() => onOpenNFT?.(item)}
        className={`relative cursor-pointer overflow-hidden bg-gradient-to-br from-[#251052] via-[#101b43] to-[#05394b] ${
          gridView
            ? "aspect-[1.38] w-full"
            : "h-28 w-36 shrink-0 rounded-lg sm:h-32 sm:w-44"
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020817]/35 via-transparent to-[#020817]/10" />

        <span
          className={`absolute left-2.5 top-2.5 rounded-md border px-2 py-1 text-[9px] font-semibold backdrop-blur-md sm:text-[10px] ${rarityColors[item.rarity]}`}
        >
          {item.rarity}
        </span>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(item.id);
          }}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
            isFavorite
              ? "border-pink-400/40 bg-pink-500/20 text-pink-400"
              : "border-white/15 bg-black/35 text-white hover:border-pink-400/50 hover:text-pink-400"
          }`}
        >
          <FiHeart size={15} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <div className={gridView ? "p-3 sm:p-3.5" : "min-w-0 flex-1"}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              onClick={() => onOpenNFT?.(item)}
              className="flex max-w-full items-center gap-1.5 text-left text-sm font-semibold text-slate-100 transition hover:text-cyan-300"
            >
              <span className="truncate">
                {item.name} #{item.id}
              </span>
              {item.verified && (
                <FiCheckCircle className="shrink-0 text-cyan-400" size={13} />
              )}
            </button>
            <p className="mt-1 truncate text-[11px] text-slate-500">
              {item.collection}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 text-[10px] font-bold text-white">
                ◎
              </span>
              <span className="text-sm font-semibold text-white">
                {item.price.toFixed(1)} SOL
              </span>
            </div>
            <p className="mt-1 pl-6 text-[10px] text-slate-500">
              ≈ ${usdPrice(item.price)}
            </p>
          </div>

          {item.status === "Listed" ? (
            <button
              onClick={() => onListForSale?.(item)}
              className="rounded-lg border border-purple-500/50 px-3 py-2 text-[10px] font-semibold text-purple-300 transition hover:bg-purple-500/10 sm:text-[11px]"
            >
              <FiTag className="mr-1 inline" size={12} />
              List for Sale
            </button>
          ) : (
            <button
              onClick={() => onBuy?.(item)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-[10px] font-semibold text-white shadow-[0_0_18px_rgba(124,58,237,0.12)] transition hover:brightness-110 sm:text-[11px]"
            >
              <FiShoppingBag className="mr-1 inline" size={12} />
              Buy Now
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#14233a] pt-2.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <FiUsers size={12} />
            {item.owners}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={12} />
            {item.listedDaysAgo === 1
              ? "1 day ago"
              : item.listedDaysAgo < 7
                ? `${item.listedDaysAgo} days ago`
                : "1 week ago"}
          </span>
        </div>
      </div>
    </article>
  );
}
