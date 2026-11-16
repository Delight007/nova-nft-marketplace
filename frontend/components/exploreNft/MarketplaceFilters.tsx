"use client";

import { useState } from "react";
import { FiCheck, FiChevronDown, FiGrid, FiList } from "react-icons/fi";

const categories = [
  "All",
  "Art",
  "Gaming",
  "Collectibles",
  "Music",
  "Photography",
  "Utility",
];

const sortOptions = [
  { label: "Recently Listed", value: "recent" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Lowest Price", value: "price-asc" },
  { label: "Highest Price", value: "price-desc" },
] as const;

export type MarketplaceSort = (typeof sortOptions)[number]["value"];
export type MarketplaceView = "grid" | "list";

type MarketplaceFiltersProps = {
  category: string;
  onCategoryChange: (category: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (verified: boolean) => void;
  sortBy: MarketplaceSort;
  onSortChange: (sort: MarketplaceSort) => void;
  view: MarketplaceView;
  onViewChange: (view: MarketplaceView) => void;
};

export default function MarketplaceFilters({
  category,
  onCategoryChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
}: MarketplaceFiltersProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const currentSort =
    sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];

  return (
    <section className="container border-b border-white/5">
      <div className="container mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 motion-safe:animate-[nova-fade-up_350ms_ease-out_both] sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-10">
        <div className="w-full overflow-x-auto overscroll-x-contain scrollbar-hidden">
          <div className="flex w-max items-center gap-2">
            {categories.map((item) => {
              const isActive = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onCategoryChange(item)}
                  aria-pressed={isActive}
                  className={`min-h-11 shrink-0 rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "border border-white/5 bg-[#08101f] text-slate-400 hover:border-purple-500/20 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-2 sm:gap-3 lg:w-auto lg:flex-nowrap lg:justify-end">
          <button
            type="button"
            onClick={() => onVerifiedOnlyChange(!verifiedOnly)}
            aria-pressed={verifiedOnly}
            className="flex min-h-10 items-center gap-2 text-[11px] text-slate-400 transition hover:text-white sm:text-xs"
          >
            <span>Verified Only</span>
            <span
              className={`relative h-4 w-9 rounded-full transition-colors ${
                verifiedOnly ? "bg-cyan-400" : "bg-slate-800"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                  verifiedOnly ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((previous) => !previous)}
              aria-expanded={sortOpen}
              className="flex min-h-10 max-w-full items-center gap-1.5 rounded-xl border border-white/5 px-2.5 text-[11px] text-slate-300 transition hover:border-purple-500/30 sm:gap-3 sm:px-4 sm:text-xs"
            >
              <span className="text-slate-500">Sort by</span>
              <span>{currentSort.label}</span>
              <FiChevronDown
                className={`text-slate-500 transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020] p-1.5 shadow-2xl shadow-black/40">
                {sortOptions.map((option) => {
                  const isSelected = sortBy === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onSortChange(option.value);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        isSelected
                          ? "bg-purple-500/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <FiCheck className="text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center rounded-xl border border-white/5 bg-[#08101f] p-1">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                view === "grid"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <FiGrid />
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                view === "list"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
