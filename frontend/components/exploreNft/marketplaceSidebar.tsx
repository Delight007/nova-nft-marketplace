"use client";

import Image from "next/image";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import {
  FiChevronDown,
  FiRotateCcw,
  FiSearch,
  FiSliders,
} from "react-icons/fi";

const collections = [
  { name: "Neon Realms", count: 1240, image: "/images/n.png" },
  { name: "Solana Spirits", count: 856, image: "/images/n2.png" },
  { name: "Cyber Apes", count: 642, image: "/images/n3.jpg" },
  { name: "Digital Dreams", count: 421, image: "/images/n.png" },
];

const filterGroups = [
  {
    title: "Status",
    options: ["Buy Now", "On Auction", "New"],
  },
  {
    title: "Sale Type",
    options: ["Fixed Price", "Auction"],
  },
];

export default function MarketplaceSidebar() {
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Price Range",
    "Collections",
    "Status",
    "Sale Type",
  ]);

  const [search, setSearch] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50]);

  const minPrice = String(priceRange[0]);
  const maxPrice = String(priceRange[1]);

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

  function resetFilters() {
    setPriceRange([0, 50]);
    setSearch("");
    setSelectedCollections([]);
    setSelectedOptions([]);
  }

  function sectionHeader(title: string) {
    return (
      <button
        type="button"
        onClick={() => toggleGroup(title)}
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
        <h2 className="flex text-sm items-center gap-2 font-semibold text-white">
          <FiSliders className="text-purple-400" />
          Filters
        </h2>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-purple-300"
        >
          <FiRotateCcw />
          Reset
        </button>
      </div>

      {/* Price range */}
      <div className="border-b border-white/[0.07]">
        {sectionHeader("Price Range")}

        {openGroups.includes("Price Range") && (
          <div className="pb-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">Price in SOL</p>
              <span className="text-xs text-purple-300">
                {priceRange[0]} – {priceRange[1]} SOL
              </span>
            </div>

            {/* Material UI range slider */}
            <Slider
              value={priceRange}
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  setPriceRange(newValue);
                }
              }}
              min={0}
              max={50}
              step={0.5}
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
                  boxShadow: "0 0 12px rgba(168,85,247,0.35)",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 8px rgba(168,85,247,0.15)",
                  },
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#171329",
                  border: "1px solid #6d28d9",
                  borderRadius: "6px",
                  fontSize: "11px",
                },
              }}
            />

            {/* Minimum and maximum inputs */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="min-price"
                  className="mb-1.5 block text-[11px] text-slate-500"
                >
                  Min price
                </label>
                <input
                  id="min-price"
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  step={0.5}
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      e.target.value !== "" &&
                      Number.isFinite(value) &&
                      value >= 0 &&
                      value <= priceRange[1]
                    ) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  className="w-full min-w-0 rounded-lg border border-white/10 bg-[#0d1425] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label
                  htmlFor="max-price"
                  className="mb-1.5 block text-[11px] text-slate-500"
                >
                  Max price
                </label>
                <input
                  id="max-price"
                  type="number"
                  min={priceRange[0]}
                  max={50}
                  step={0.5}
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (
                      e.target.value !== "" &&
                      Number.isFinite(value) &&
                      value >= priceRange[0] &&
                      value <= 50
                    ) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  className="w-full min-w-0 rounded-lg border border-white/10 bg-[#0d1425] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-slate-600">
              <span>0 SOL</span>
              <span>50 SOL</span>
            </div>
          </div>
        )}
      </div>

      {/* Collections */}
      <div className="border-b border-white/[0.07]">
        {sectionHeader("Collections")}

        {openGroups.includes("Collections") && (
          <div className="pb-4">
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d1425] px-3">
              <FiSearch className="shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections"
                className="min-w-0 w-full bg-transparent py-2.5 text-xs text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-3">
              {collections
                .filter((collection) =>
                  collection.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((collection) => (
                  <label
                    key={collection.name}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.name)}
                      onChange={() =>
                        toggleSelection(
                          collection.name,
                          selectedCollections,
                          setSelectedCollections,
                        )
                      }
                      className="h-3.5 w-3.5 accent-purple-500"
                    />

                    <Image
                      src={collection.image}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-md object-cover"
                    />

                    <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
                      {collection.name}
                    </span>

                    <span className="text-[10px] text-slate-600">
                      {collection.count.toLocaleString()} items
                    </span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Other filter groups */}
      {filterGroups.map((group) => (
        <div key={group.title} className="border-b border-white/[0.07]">
          {sectionHeader(group.title)}

          {openGroups.includes(group.title) && (
            <div className="space-y-3 pb-4">
              {group.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() =>
                      toggleSelection(
                        option,
                        selectedOptions,
                        setSelectedOptions,
                      )
                    }
                    className="h-3.5 w-3.5 accent-purple-500"
                  />

                  <span className="text-xs text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
