"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  FiChevronDown,
  FiFilter,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { rarityCounts, traitOptions } from "./collectionItemsData";
import type { NFTItem } from "./collectionItemsData";

type CollectionItemsFiltersProps = {
  variant: "sidebar" | "mobile";
  mobileFiltersOpen: boolean;
  onCloseMobileFilters: () => void;
  selectedRarities: string[];
  setSelectedRarities: Dispatch<SetStateAction<string[]>>;
  selectedTraits: Record<string, string[]>;
  setSelectedTraits: Dispatch<SetStateAction<Record<string, string[]>>>;
  selectedStatuses: string[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  expandedSections: string[];
  setExpandedSections: Dispatch<SetStateAction<string[]>>;
  onClearFilters: () => void;
};

const sections = [
  { title: "Rarity", options: Object.keys(rarityCounts) },
  { title: "Traits", options: Object.keys(traitOptions) },
  { title: "Status", options: ["Buy Now", "Listed", "Has Offers"] },
  { title: "Sale Type", options: ["Fixed Price", "Auction"] },
];

export default function CollectionItemsFilters(
  props: CollectionItemsFiltersProps,
) {
  const panel = <FilterPanel {...props} />;

  if (props.variant === "sidebar") {
    return panel;
  }

  if (!props.mobileFiltersOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close filters"
        onClick={props.onCloseMobileFilters}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="absolute inset-y-0 left-0 w-[min(340px,88vw)] overflow-y-auto border-r border-[#203454] bg-[#020817] p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Filter NFTs</h3>
          <button
            onClick={props.onCloseMobileFilters}
            className="rounded-lg border border-[#203454] p-2 text-slate-400 hover:text-white"
            aria-label="Close filters"
          >
            <FiX />
          </button>
        </div>
        {panel}
      </div>
    </div>
  );
}

function FilterPanel({
  selectedRarities,
  setSelectedRarities,
  selectedTraits,
  setSelectedTraits,
  selectedStatuses,
  setSelectedStatuses,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  expandedSections,
  setExpandedSections,
  onClearFilters,
  onCloseMobileFilters,
}: CollectionItemsFiltersProps) {
  const toggleValue = (
    value: string,
    values: string[],
    setValues: Dispatch<SetStateAction<string[]>>,
  ) => {
    setValues((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
  };

  const clearTrait = (trait: string, value: string) => {
    setSelectedTraits((current) => ({
      ...current,
      [trait]: (current[trait] || []).filter((item) => item !== value),
    }));
  };

  return (
    <aside className="rounded-xl border border-[#172b4b] bg-[#050d1b]/95 p-3 sm:p-4">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <FiFilter className="text-[#a78bfa]" />
          Filters
        </div>
        <button
          onClick={onClearFilters}
          className="text-[11px] text-slate-400 transition hover:text-cyan-300"
        >
          Clear all
        </button>
      </div>

      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-200">Price</span>
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
            className="text-[10px] text-slate-500 hover:text-cyan-300"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center rounded-lg border border-[#203454] bg-[#071326] px-2">
            <span className="mr-2 text-[10px] text-slate-500">Ξ</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
              className="w-full min-w-0 bg-transparent py-2 text-xs text-white outline-none placeholder:text-slate-500"
            />
            <span className="text-[10px] text-slate-500">SOL</span>
          </label>
          <label className="flex items-center rounded-lg border border-[#203454] bg-[#071326] px-2">
            <span className="mr-2 text-[10px] text-slate-500">Ξ</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
              className="w-full min-w-0 bg-transparent py-2 text-xs text-white outline-none placeholder:text-slate-500"
            />
            <span className="text-[10px] text-slate-500">SOL</span>
          </label>
        </div>

        <div className="mt-3 flex items-center gap-2 px-1">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400" />
          <span className="h-3 w-3 rounded-full bg-cyan-400" />
        </div>
      </div>

      {sections.map((section) => {
        const expanded = expandedSections.includes(section.title);

        return (
          <div key={section.title} className="border-t border-[#172b45] py-3">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between text-xs font-medium text-slate-200"
            >
              {section.title}
              <FiChevronDown
                className={`transition-transform ${expanded ? "" : "-rotate-90"}`}
              />
            </button>

            {expanded && (
              <div className="mt-3 space-y-2.5">
                {section.options.map((option) => {
                  if (section.title === "Traits") {
                    const values = selectedTraits[option] || [];
                    const options =
                      traitOptions[option as keyof NFTItem["traits"]] || [];

                    return (
                      <div key={option}>
                        <button
                          onClick={() => toggleSection(`trait-${option}`)}
                          className="flex w-full items-center justify-between text-xs text-slate-400 hover:text-white"
                        >
                          {option}
                          <FiPlus
                            className={`transition-transform ${
                              expandedSections.includes(`trait-${option}`)
                                ? "rotate-45"
                                : ""
                            }`}
                          />
                        </button>

                        {expandedSections.includes(`trait-${option}`) && (
                          <div className="ml-1 mt-2 space-y-2 border-l border-[#233956] pl-3">
                            {options.map((value) => (
                              <label
                                key={value}
                                className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-400 hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={values.includes(value)}
                                  onChange={() =>
                                    setSelectedTraits((current) => {
                                      const selected = current[option] || [];
                                      return {
                                        ...current,
                                        [option]: selected.includes(value)
                                          ? selected.filter(
                                              (item) => item !== value,
                                            )
                                          : [...selected, value],
                                      };
                                    })
                                  }
                                  className="accent-purple-500"
                                />
                                {value}
                              </label>
                            ))}
                          </div>
                        )}

                        {values.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {values.map((value) => (
                              <button
                                key={value}
                                onClick={() => clearTrait(option, value)}
                                className="rounded bg-purple-500/10 px-1.5 py-1 text-[9px] text-purple-300"
                              >
                                {value} <FiX className="ml-1 inline" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const checked =
                    section.title === "Rarity"
                      ? selectedRarities.includes(option)
                      : section.title === "Status"
                        ? selectedStatuses.includes(option)
                        : false;

                  return (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-400 hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (section.title === "Rarity") {
                            toggleValue(
                              option,
                              selectedRarities,
                              setSelectedRarities,
                            );
                          } else if (section.title === "Status") {
                            toggleValue(
                              option,
                              selectedStatuses,
                              setSelectedStatuses,
                            );
                          } else {
                            toggleSection(`sale-${option}`);
                          }
                        }}
                        className="accent-purple-500"
                      />

                      {section.title === "Rarity" && (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            option === "Common"
                              ? "bg-slate-400"
                              : option === "Uncommon"
                                ? "bg-emerald-400"
                                : option === "Rare"
                                  ? "bg-sky-400"
                                  : option === "Epic"
                                    ? "bg-fuchsia-500"
                                    : "bg-amber-400"
                          }`}
                        />
                      )}

                      <span className="flex-1">{option}</span>

                      {section.title === "Rarity" && (
                        <span className="text-[10px] text-slate-500">
                          {rarityCounts[option as NFTItem["rarity"]]}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onCloseMobileFilters}
        className="mt-3 w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 py-2.5 text-xs font-semibold text-white transition hover:brightness-110"
      >
        Apply Filters
      </button>
    </aside>
  );
}
