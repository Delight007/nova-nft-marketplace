"use client";

import Slider from "@mui/material/Slider";
import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiRotateCcw,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import type { Collection } from "@/services/collections";

const filterGroups = [
  {
    title: "Listing Status",
    options: [
      { label: "Buy Now", value: "listed" },
      { label: "Not Listed", value: "unlisted" },
      { label: "Recently Added", value: "new" },
    ],
  },
  {
    title: "Sale Type",
    options: [{ label: "Fixed Price", value: "fixed-price" }],
  },
];

type MarketplaceSidebarProps = {
  collections: Collection[];
  selectedCollections: string[];
  onCollectionsChange: (collections: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  selectedSaleTypes: string[];
  onSaleTypesChange: (saleTypes: string[]) => void;
  minPrice: number;
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
};

export default function MarketplaceSidebar({
  collections,
  selectedCollections,
  onCollectionsChange,
  selectedStatuses,
  onStatusesChange,
  selectedSaleTypes,
  onSaleTypesChange,
  minPrice,
  maxPrice,
  onPriceRangeChange,
  onReset,
}: MarketplaceSidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Price Range",
    "Collections",
    "Listing Status",
    "Sale Type",
  ]);
  const [search, setSearch] = useState("");

  const visibleCollections = useMemo(
    () =>
      collections.filter((collection) =>
        collection.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [collections, search],
  );

  function toggleGroup(group: string) {
    setOpenGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group],
    );
  }

  function toggleSelection(
    value: string,
    selected: string[],
    setter: (next: string[]) => void,
  ) {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  }

  function sectionHeader(title: string) {
    return (
      <button
        type="button"
        onClick={() => toggleGroup(title)}
        aria-expanded={openGroups.includes(title)}
        className="flex w-full items-center justify-between py-3.5 text-xs font-semibold text-white"
      >
        {title}
        <FiChevronDown
          className={`text-slate-500 transition ${
            openGroups.includes(title) ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#080d1b] p-4">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <FiSliders className="text-purple-400" />
          Filters
        </h2>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            onReset();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-purple-300"
        >
          <FiRotateCcw />
          Reset
        </button>
      </div>

      <div className="border-b border-white/[0.07]">
        {sectionHeader("Price Range")}
        {openGroups.includes("Price Range") && (
          <div className="pb-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">Price in SOL</p>
              <span className="text-xs text-purple-300">
                {minPrice} – {maxPrice >= 500 ? "Any" : maxPrice} SOL
              </span>
            </div>
            <Slider
              value={[minPrice, maxPrice]}
              onChange={(_, value) => {
                if (Array.isArray(value)) {
                  onPriceRangeChange([value[0], value[1]]);
                }
              }}
              min={0}
              max={500}
              step={1}
              disableSwap
              aria-label="NFT price range"
              sx={{
                color: "#a855f7",
                height: 4,
                padding: "13px 0",
                "& .MuiSlider-rail": {
                  backgroundColor: "#293247",
                  opacity: 1,
                },
                "& .MuiSlider-track": {
                  border: "none",
                  background:
                    "linear-gradient(90deg, #9333ea 0%, #22d3ee 100%)",
                },
                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 14,
                  backgroundColor: "#ffffff",
                  border: "3px solid #a855f7",
                },
              }}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-[11px] text-slate-500">
                Min price
                <input
                  type="number"
                  min={0}
                  max={maxPrice}
                  step={0.1}
                  value={minPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (
                      event.target.value !== "" &&
                      Number.isFinite(value) &&
                      value >= 0 &&
                      value <= maxPrice
                    ) {
                      onPriceRangeChange([value, maxPrice]);
                    }
                  }}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0d1425] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                />
              </label>
              <label className="text-[11px] text-slate-500">
                Max price
                <input
                  type="number"
                  min={minPrice}
                  max={500}
                  step={0.1}
                  value={maxPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (
                      event.target.value !== "" &&
                      Number.isFinite(value) &&
                      value >= minPrice &&
                      value <= 500
                    ) {
                      onPriceRangeChange([minPrice, value]);
                    }
                  }}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0d1425] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                />
              </label>
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-slate-600">
              <span>0 SOL</span>
              <span>500+ SOL</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-white/[0.07]">
        {sectionHeader("Collections")}
        {openGroups.includes("Collections") && (
          <div className="pb-4">
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d1425] px-3">
              <FiSearch className="shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search collections"
                aria-label="Search collections"
                className="w-full min-w-0 bg-transparent py-2.5 text-xs text-white outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {visibleCollections.map((collection) => (
                <label
                  key={collection.slug}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.slug)}
                    onChange={() =>
                      toggleSelection(
                        collection.slug,
                        selectedCollections,
                        onCollectionsChange,
                      )
                    }
                    className="h-3.5 w-3.5 accent-purple-500"
                  />
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-[#0d1425]">
                    {collection.previewImage || collection.banner ? (
                      <img
                        src={collection.previewImage ?? collection.banner ?? ""}
                        alt=""
                        className="object-cover"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
                    {collection.name}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {collection.items.toLocaleString()}
                  </span>
                </label>
              ))}
              {visibleCollections.length === 0 && (
                <p className="text-xs text-slate-500">No collections found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {filterGroups.map((group) => {
        const selected =
          group.title === "Listing Status" ? selectedStatuses : selectedSaleTypes;
        const onChange =
          group.title === "Listing Status"
            ? onStatusesChange
            : onSaleTypesChange;

        return (
          <div key={group.title} className="border-b border-white/[0.07]">
            {sectionHeader(group.title)}
            {openGroups.includes(group.title) && (
              <div className="space-y-3 pb-4">
                {group.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() =>
                        toggleSelection(option.value, selected, onChange)
                      }
                      className="h-3.5 w-3.5 accent-purple-500"
                    />
                    <span className="text-xs text-slate-400">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
