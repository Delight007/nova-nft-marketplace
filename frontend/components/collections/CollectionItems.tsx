"use client";

import { useMemo, useState } from "react";
import { FiActivity, FiTag } from "react-icons/fi";
import CollectionItemsBars from "./collectionItems/CollectionItemsBars";
import CollectionItemsFilters from "./collectionItems/CollectionItemsFilters";
import CollectionItemsGrid from "./collectionItems/CollectionItemsGrid";
import { nftItems } from "./collectionItems/collectionItemsData";
import type {
  CollectionItemsTab,
  NFTItem,
} from "./collectionItems/collectionItemsData";

type CollectionItemsProps = {
  onBuy?: (item: NFTItem) => void;
  onListForSale?: (item: NFTItem) => void;
  onOpenNFT?: (item: NFTItem) => void;
};

export default function CollectionItems({
  onBuy,
  onListForSale,
  onOpenNFT,
}: CollectionItemsProps) {
  const [activeTab, setActiveTab] = useState<CollectionItemsTab>("Items");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<
    Record<string, string[]>
  >({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Rarity",
    "Traits",
    "Status",
    "Sale Type",
  ]);

  const clearFilters = () => {
    setSelectedRarities([]);
    setSelectedTraits({});
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  const filteredNFTs = useMemo(() => {
    const result = nftItems.filter((item) => {
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.collection.toLowerCase().includes(normalizedSearch) ||
        item.id.includes(search);
      const matchesRarity =
        selectedRarities.length === 0 ||
        selectedRarities.includes(item.rarity);
      const matchesPrice =
        (minPrice === "" || item.price >= Number(minPrice)) &&
        (maxPrice === "" || item.price <= Number(maxPrice));
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.some((status) => {
          if (status === "Buy Now") return item.status === "Buy Now";
          if (status === "Listed") return item.status === "Listed";
          if (status === "Has Offers") return item.price >= 5;
          return true;
        });
      const matchesTraits = Object.entries(selectedTraits).every(
        ([trait, values]) =>
          values.length === 0 ||
          values.includes(item.traits[trait as keyof NFTItem["traits"]]),
      );

      return (
        matchesSearch &&
        matchesRarity &&
        matchesPrice &&
        matchesStatus &&
        matchesTraits
      );
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "recent")
      result.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);

    return result;
  }, [
    search,
    selectedRarities,
    selectedTraits,
    selectedStatuses,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const usdPrice = (price: number) =>
    (price * 120).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const hasActiveFilters =
    selectedRarities.length > 0 ||
    selectedStatuses.length > 0 ||
    Object.values(selectedTraits).some((values) => values.length > 0) ||
    minPrice !== "" ||
    maxPrice !== "";

  const filterProps = {
    mobileFiltersOpen,
    onCloseMobileFilters: () => setMobileFiltersOpen(false),
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
    onClearFilters: clearFilters,
  };

  return (
    <section className="min-h-screen bg-[#020817] px-3 pb-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <CollectionItemsBars
          activeTab={activeTab}
          onTabChange={setActiveTab}
          itemCount={nftItems.length}
          search={search}
          onSearchChange={setSearch}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          gridView={gridView}
          onGridViewChange={setGridView}
          selectedRarities={selectedRarities}
          onRemoveRarity={(rarity) =>
            setSelectedRarities((current) =>
              current.filter((item) => item !== rarity),
            )
          }
          selectedStatuses={selectedStatuses}
          onRemoveStatus={(status) =>
            setSelectedStatuses((current) =>
              current.filter((item) => item !== status),
            )
          }
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {activeTab === "Items" ? (
          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[265px_minmax(0,1fr)] xl:gap-7">
            <div className="hidden lg:block">
              <CollectionItemsFilters variant="sidebar" {...filterProps} />
            </div>

            <div className="min-w-0">
              <CollectionItemsGrid
                items={filteredNFTs}
                totalItems={nftItems.length}
                gridView={gridView}
                favorites={favorites}
                usdPrice={usdPrice}
                onToggleFavorite={(id) =>
                  setFavorites((current) =>
                    current.includes(id)
                      ? current.filter((favorite) => favorite !== id)
                      : [...current, id],
                  )
                }
                onClearFilters={clearFilters}
                onBuy={onBuy}
                onListForSale={onListForSale}
                onOpenNFT={onOpenNFT}
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300">
              {activeTab === "Activity" ? (
                <FiActivity size={22} />
              ) : (
                <FiTag size={22} />
              )}
            </div>
            <h3 className="text-base font-semibold text-white">
              {activeTab === "Activity"
                ? "Collection Activity"
                : "Collection Offers"}
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              {activeTab === "Activity"
                ? "NFT sales, listings, transfers, and other on-chain events will appear here once activity data is connected."
                : "Offers made on NFTs in this collection will appear here once offer data is connected."}
            </p>
          </div>
        )}

        <CollectionItemsFilters variant="mobile" {...filterProps} />
      </div>
    </section>
  );
}
