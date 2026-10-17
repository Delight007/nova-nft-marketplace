"use client";

import {
  FiGrid,
  FiList,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";
import type { CollectionItemsTab } from "./collectionItemsData";

type CollectionItemsBarsProps = {
  activeTab: CollectionItemsTab;
  onTabChange: (tab: CollectionItemsTab) => void;
  itemCount: number;
  search: string;
  onSearchChange: (search: string) => void;
  onOpenFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  gridView: boolean;
  onGridViewChange: (gridView: boolean) => void;
  selectedRarities: string[];
  onRemoveRarity: (rarity: string) => void;
  selectedStatuses: string[];
  onRemoveStatus: (status: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export default function CollectionItemsBars({
  activeTab,
  onTabChange,
  itemCount,
  search,
  onSearchChange,
  onOpenFilters,
  sortBy,
  onSortChange,
  gridView,
  onGridViewChange,
  selectedRarities,
  onRemoveRarity,
  selectedStatuses,
  onRemoveStatus,
  hasActiveFilters,
  onClearFilters,
}: CollectionItemsBarsProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#172b45]">
        <div className="flex items-center gap-7 sm:gap-10">
          {(["Items", "Activity", "Offers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative py-4 text-xs font-medium transition sm:text-sm ${
                activeTab === tab
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 pb-2 sm:flex">
          <span className="text-xs text-slate-500">Neon Realms</span>
          <span className="rounded-full border border-[#243758] bg-[#0a1528] px-2 py-1 text-[10px] text-slate-400">
            {itemCount} sample items
          </span>
        </div>
      </div>

      {activeTab === "Items" && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <label className="flex min-w-[150px] max-w-sm flex-1 items-center gap-2 rounded-lg border border-[#1b2e4c] bg-[#071326] px-3 py-2.5">
                <FiSearch className="shrink-0 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search NFTs..."
                  className="w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                />
                {search && (
                  <button
                    onClick={() => onSearchChange("")}
                    aria-label="Clear search"
                  >
                    <FiX className="text-slate-500 hover:text-white" />
                  </button>
                )}
              </label>

              <button
                onClick={onOpenFilters}
                className="flex items-center gap-2 rounded-lg border border-[#1b2e4c] bg-[#071326] px-3 py-2.5 text-xs text-slate-300 lg:hidden"
              >
                <FiSliders />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(event) => onSortChange(event.target.value)}
                  className="max-w-[150px] rounded-lg border border-[#1b2e4c] bg-[#071326] px-2 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500"
                >
                  <option value="recent">Recently Listed</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>

              <div className="hidden items-center rounded-lg border border-[#1b2e4c] bg-[#071326] p-1 sm:flex">
                <button
                  onClick={() => onGridViewChange(true)}
                  aria-label="Grid view"
                  className={`rounded-md p-2 ${
                    gridView
                      ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <FiGrid size={14} />
                </button>
                <button
                  onClick={() => onGridViewChange(false)}
                  aria-label="List view"
                  className={`rounded-md p-2 ${
                    !gridView
                      ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <FiList size={14} />
                </button>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {selectedRarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => onRemoveRarity(rarity)}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] text-purple-300"
                >
                  {rarity} <FiX className="ml-1 inline" />
                </button>
              ))}
              {selectedStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => onRemoveStatus(status)}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] text-cyan-300"
                >
                  {status} <FiX className="ml-1 inline" />
                </button>
              ))}
              <button
                onClick={onClearFilters}
                className="text-[11px] text-slate-500 hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
