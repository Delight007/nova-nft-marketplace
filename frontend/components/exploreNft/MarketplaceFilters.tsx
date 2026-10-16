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
  "Lowest Price",
  "Highest Price",
  "Recently Listed",
  "Most Viewed",
  "Newest",
];

export default function MarketplaceFilters() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Lowest Price");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section className="container border-b border-white/5">
      <div className="container mx-auto px-6 lg:px-10 max-w-7xl flex items-center justify-between  py-2">
        {/* Categories */}
        <div className="flex  items-center gap-2 ">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "border border-white/5 bg-[#08101f] text-slate-400 hover:border-purple-500/20 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {/* Verified Only */}
          <button
            type="button"
            onClick={() => setVerifiedOnly((prev) => !prev)}
            className="flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"
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

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl border border-white/5  px-4 py-2.5 text-xs text-slate-300 transition hover:border-purple-500/30"
            >
              <span className="text-slate-500">Sort by</span>

              <span>{sortBy}</span>

              <FiChevronDown
                className={`text-slate-500 transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {sortOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020] p-1.5 shadow-2xl shadow-black/40">
                {sortOptions.map((option) => {
                  const isSelected = sortBy === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs  transition ${
                        isSelected
                          ? "bg-purple-500/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{option}</span>

                      {isSelected && <FiCheck className="text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* View switcher */}
          <div className="flex items-center rounded-xl border border-white/5 bg-[#08101f] p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                view === "grid"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-500 hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                view === "list"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-500 hover:text-white"
              }`}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
