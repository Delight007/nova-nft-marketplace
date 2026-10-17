"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiGrid, FiList } from "react-icons/fi";

type CollectionsTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const tabs = ["All Collections", "Verified", "Trending", "New"];

export default function CollectionsTabs({
  activeTab,
  onTabChange,
}: CollectionsTabsProps) {
  return (
    <div className="flex min-h-[42px] items-center justify-between border-b border-white/10">
      {/* Tabs */}
      <div className="flex h-full items-center gap-7">
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative flex h-full items-center px-1 text-[13px] transition ${
                active
                  ? "font-semibold text-white"
                  : "text-blue-200/80 hover:text-white"
              }`}
            >
              {tab}

              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <div className="flex h-8 overflow-hidden rounded-lg border border-blue-500/30 bg-[#07152a]">
          <button
            type="button"
            className="flex w-9 items-center justify-center bg-blue-600/30 text-white"
            aria-label="Grid view"
          >
            <FiGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="flex w-9 items-center justify-center text-blue-300 transition hover:text-white"
            aria-label="List view"
          >
            <FiList className="h-4 w-4" />
          </button>
        </div>

        <span className="hidden text-[11px] text-blue-200 md:block">
          Showing 1 - 12 of 124 collections
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white"
            aria-label="Previous page"
          >
            <FaChevronLeft className="h-2.5 w-2.5" />
          </button>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white"
            aria-label="Next page"
          >
            <FaChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
