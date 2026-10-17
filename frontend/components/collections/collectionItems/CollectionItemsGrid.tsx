"use client";

import { FiChevronRight, FiSearch } from "react-icons/fi";
import CollectionItemCard from "./CollectionItemCard";
import type { NFTItem } from "./collectionItemsData";

type CollectionItemsGridProps = {
  items: NFTItem[];
  totalItems: number;
  gridView: boolean;
  favorites: string[];
  usdPrice: (price: number) => string;
  onToggleFavorite: (id: string) => void;
  onClearFilters: () => void;
  onBuy?: (item: NFTItem) => void;
  onListForSale?: (item: NFTItem) => void;
  onOpenNFT?: (item: NFTItem) => void;
};

export default function CollectionItemsGrid({
  items,
  totalItems,
  gridView,
  favorites,
  usdPrice,
  onToggleFavorite,
  onClearFilters,
  onBuy,
  onListForSale,
  onOpenNFT,
}: CollectionItemsGridProps) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-200">{items.length}</span> of{" "}
          {totalItems} items
        </p>
        <p className="hidden text-[11px] text-slate-600 sm:block">
          Prices in SOL
        </p>
      </div>

      {items.length > 0 ? (
        <div
          className={
            gridView
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              : "flex flex-col gap-3"
          }
        >
          {items.map((item) => (
            <CollectionItemCard
              key={item.id}
              item={item}
              gridView={gridView}
              isFavorite={favorites.includes(item.id)}
              usdPrice={usdPrice}
              onToggleFavorite={onToggleFavorite}
              onBuy={onBuy}
              onListForSale={onListForSale}
              onOpenNFT={onOpenNFT}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-[#203454] bg-[#050d1b] px-5 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-purple-300">
            <FiSearch size={22} />
          </div>
          <h3 className="text-base font-semibold text-white">No NFTs found</h3>
          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
            Try adjusting your search or removing some filters to find NFTs in
            this collection.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-5 rounded-lg border border-purple-500/40 px-4 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-500/10"
          >
            Clear all filters
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-2 rounded-lg border border-[#203454] bg-[#071326] px-5 py-3 text-xs font-medium text-slate-300 transition hover:border-purple-500/50 hover:text-white">
          Load More NFTs
          <FiChevronRight />
        </button>
      </div>
    </>
  );
}
