"use client";

import { useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { MdOutlineCategory } from "react-icons/md";
import type { ActivityFilterState, ActivityType } from "./activity";

type ActivityFiltersProps = {
  onFilterChange?: (filters: ActivityFilterState) => void;
};

const eventTypes: ActivityType[] = [
  "Sale",
  "Listing",
  "Offer",
  "Transfer",
  "Mint",
];

export default function ActivityFilters({
  onFilterChange,
}: ActivityFiltersProps) {
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [collection, setCollection] = useState("All Collections");
  const [walletAddress, setWalletAddress] = useState("");
  const [dateRange, setDateRange] = useState("Last 7 days");

  const updateFilters = (
    types = selectedTypes,
    selectedCollection = collection,
    wallet = walletAddress,
    date = dateRange,
  ) => {
    onFilterChange?.({
      types,
      collection: selectedCollection,
      walletAddress: wallet,
      dateRange: date,
    });
  };

  const toggleType = (type: ActivityType) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type];

    setSelectedTypes(next);
    updateFilters(next);
  };

  const clearAll = () => {
    setSelectedTypes([]);
    setCollection("All Collections");
    setWalletAddress("");
    setDateRange("Last 7 days");

    onFilterChange?.({
      types: [],
      collection: "All Collections",
      walletAddress: "",
      dateRange: "Last 7 days",
    });
  };

  return (
    <aside className="w-full rounded-2xl border border-[#172f68] bg-[#030d24]/90 p-3.5 lg:w-[250px] lg:shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#172653] pb-4">
        <div className="flex items-center gap-2">
          <HiOutlineAdjustmentsHorizontal className="text-lg text-[#a978ff]" />
          <span className="text-sm font-semibold text-white">Filters</span>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-[#7da0df] transition hover:text-white"
        >
          Clear all
        </button>
      </div>

      {/* Event type */}
      <div className="border-b border-[#172653] py-5">
        <div className="mb-4 flex items-center gap-2">
          <FiFilter className="text-sm text-[#8b7cff]" />
          <span className="text-xs font-semibold text-white">Event Type</span>
        </div>

        <div className="space-y-3">
          {eventTypes.map((type, index) => {
            const checked = selectedTypes.includes(type);

            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition ${
                      checked
                        ? "border-transparent bg-gradient-to-br from-[#9b3cff] to-[#0ddcff]"
                        : "border-[#294a88] bg-[#06132e]"
                    }`}
                  >
                    {checked && (
                      <span className="text-[11px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </span>

                  <span
                    className={`text-xs ${
                      checked ? "text-[#b9c9ff]" : "text-[#7894c8]"
                    }`}
                  >
                    {type}s
                  </span>
                </div>

                <span className="text-xs text-[#7190c7]">
                  {[342, 128, 76, 54, 18][index]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection */}
      <div className="border-b border-[#172653] py-5">
        <div className="mb-3 flex items-center gap-2">
          <MdOutlineCategory className="text-sm text-[#8b7cff]" />
          <span className="text-xs font-semibold text-white">Collection</span>
        </div>

        <div className="relative">
          <select
            value={collection}
            onChange={(event) => {
              setCollection(event.target.value);
              updateFilters(selectedTypes, event.target.value);
            }}
            className="h-10 w-full appearance-none rounded-lg border border-[#24467f] bg-[#061531] px-3 pr-9 text-xs text-[#91a9d8] outline-none transition focus:border-[#674dff]"
          >
            <option>All Collections</option>
            <option>Neon Realms</option>
            <option>Ape Society</option>
            <option>The Forgotten</option>
            <option>Sky Islands</option>
            <option>Aurora</option>
          </select>

          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#7692c8]" />
        </div>
      </div>

      {/* Wallet */}
      <div className="border-b border-[#172653] py-5">
        <div className="mb-3 flex items-center gap-2">
          <FiSearch className="text-sm text-[#8b7cff]" />
          <span className="text-xs font-semibold text-white">
            Wallet Address
          </span>
        </div>

        <div className="relative">
          <input
            value={walletAddress}
            onChange={(event) => {
              setWalletAddress(event.target.value);
              updateFilters(selectedTypes, collection, event.target.value);
            }}
            placeholder="Search wallet address..."
            className="h-10 w-full rounded-lg border border-[#24467f] bg-[#061531] px-3 pr-9 text-xs text-white outline-none placeholder:text-[#5472aa] focus:border-[#674dff]"
          />

          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#7692c8]" />
        </div>
      </div>

      {/* Date range */}
      <div className="py-5">
        <div className="mb-3 flex items-center gap-2">
          <FiCalendar className="text-sm text-[#8b7cff]" />
          <span className="text-xs font-semibold text-white">Date Range</span>
        </div>

        <div className="relative">
          <select
            value={dateRange}
            onChange={(event) => {
              setDateRange(event.target.value);
              updateFilters(
                selectedTypes,
                collection,
                walletAddress,
                event.target.value,
              );
            }}
            className="h-10 w-full appearance-none rounded-lg border border-[#24467f] bg-[#061531] px-3 pr-9 text-xs text-[#91a9d8] outline-none focus:border-[#674dff]"
          >
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>

          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#7692c8]" />
        </div>
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#912cff] via-[#6b45ff] to-[#08d9ed] text-xs font-semibold text-white shadow-[0_0_24px_rgba(105,64,255,0.2)] transition hover:scale-[1.01]"
      >
        <HiOutlineAdjustmentsHorizontal className="text-base" />
        Apply Filters
      </button>
    </aside>
  );
}
