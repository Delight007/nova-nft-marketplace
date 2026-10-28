// "use client";

// import Image from "next/image";
// import { useEffect, useMemo } from "react";
// import CollectionCard from "./CollectionCard";
// import { collections } from "./collectionsData";
// import type { CollectionFilters } from "./CollectionsExplorer";

// type CollectionGridProps = {
//   activeTab: string;
//   filters: CollectionFilters;
//   viewMode: "grid" | "list";
//   currentPage: number;
//   pageSize: number;
//   onTotalChange: (total: number) => void;
// };

// function parseSol(value: string): number {
//   return Number.parseFloat(value.replace(/,/g, "").replace(/\s*SOL/i, "")) || 0;
// }

// function parseVolume(value: string): number {
//   const cleaned = value.replace(/,/g, "").trim().toUpperCase();
//   const number = Number.parseFloat(cleaned);

//   if (!Number.isFinite(number)) return 0;
//   if (cleaned.includes("K")) return number * 1_000;
//   if (cleaned.includes("M")) return number * 1_000_000;

//   return number;
// }

// function parseItems(value: string): number {
//   return Number.parseInt(value.replace(/,/g, ""), 10) || 0;
// }

// export default function CollectionGrid({
//   activeTab,
//   filters,
//   viewMode,
//   currentPage,
//   pageSize,
//   onTotalChange,
// }: CollectionGridProps) {
//   const filteredCollections = useMemo(() => {
//     return collections
//       .filter((collection) => {
//         const query = filters.search.trim().toLowerCase();

//         if (
//           query &&
//           !collection.name.toLowerCase().includes(query) &&
//           !collection.creator.toLowerCase().includes(query)
//         ) {
//           return false;
//         }

//         if (
//           (activeTab === "Verified" || filters.status === "verified") &&
//           !collection.verified
//         ) {
//           return false;
//         }

//         if (
//           activeTab === "Trending" &&
//           !("trending" in collection && collection.trending)
//         ) {
//           return false;
//         }

//         if (
//           (activeTab === "New" || filters.status === "new") &&
//           !collection.isNew
//         ) {
//           return false;
//         }

//         if (filters.status === "trading" && !collection.activeTrading) {
//           return false;
//         }

//         if (filters.category && collection.category !== filters.category) {
//           return false;
//         }

//         const floorPrice = parseSol(collection.floorPrice);

//         if (filters.minPrice !== null && floorPrice < filters.minPrice) {
//           return false;
//         }

//         if (filters.maxPrice !== null && floorPrice > filters.maxPrice) {
//           return false;
//         }

//         return true;
//       })
//       .sort((a, b) => {
//         switch (filters.sortBy) {
//           case "Total Volume (Low to High)":
//             return parseVolume(a.volume) - parseVolume(b.volume);
//           case "Floor Price (High to Low)":
//             return parseSol(b.floorPrice) - parseSol(a.floorPrice);
//           case "Floor Price (Low to High)":
//             return parseSol(a.floorPrice) - parseSol(b.floorPrice);
//           case "Recently Added":
//             return b.id - a.id;
//           case "Most Items":
//             return parseItems(b.items) - parseItems(a.items);
//           case "Total Volume (High to Low)":
//           default:
//             return parseVolume(b.volume) - parseVolume(a.volume);
//         }
//       });
//   }, [activeTab, filters]);

//   useEffect(() => {
//     onTotalChange(filteredCollections.length);
//   }, [filteredCollections.length, onTotalChange]);

//   const startIndex = (currentPage - 1) * pageSize;
//   const paginatedCollections = filteredCollections.slice(
//     startIndex,
//     startIndex + pageSize,
//   );

//   return (
//     <div className="mt-4">
//       {paginatedCollections.length > 0 ? (
//         viewMode === "grid" ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {paginatedCollections.map((collection) => (
//               <CollectionCard key={collection.id} collection={collection} />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col gap-3">
//             {paginatedCollections.map((collection) => (
//               <div
//                 key={collection.id}
//                 className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#030b19] p-3 transition hover:border-blue-500/40 sm:gap-5 sm:p-4"
//               >
//                 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
//                   <Image
//                     src={collection.banner}
//                     alt={collection.name}
//                     fill
//                     sizes="96px"
//                     className="object-cover"
//                   />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <h3 className="truncate font-semibold text-white">
//                       {collection.name}
//                     </h3>
//                     {collection.verified && (
//                       <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-300">
//                         Verified
//                       </span>
//                     )}
//                     {collection.isNew && (
//                       <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs text-purple-300">
//                         New
//                       </span>
//                     )}
//                   </div>

//                   <p className="mt-1 truncate text-sm text-blue-200/60">
//                     by {collection.creator}
//                   </p>

//                   <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-blue-100/70 sm:text-sm">
//                     <span>{collection.items} items</span>
//                     <span>
//                       Floor:{" "}
//                       <span className="font-medium text-white">
//                         {collection.floorPrice}
//                       </span>
//                     </span>
//                     <span>
//                       Volume:{" "}
//                       <span className="font-medium text-white">
//                         {collection.volume}
//                       </span>
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     window.location.href = `/collections/${collection.id}`;
//                   }}
//                   className="shrink-0 rounded-lg border border-blue-500/30 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/10 sm:px-4 sm:text-sm"
//                 >
//                   View
//                 </button>
//               </div>
//             ))}
//           </div>
//         )
//       ) : (
//         <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-blue-500/30 bg-[#030b19] px-6 text-center">
//           <p className="text-sm font-semibold text-white">
//             No collections found
//           </p>
//           <p className="mt-2 max-w-sm text-xs text-blue-200/70">
//             Try changing your search, category, status, or price range.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCollections } from "@/hooks/use-Collections";
import type { Collection } from "@/services/collections";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import CollectionCard from "./CollectionCard";
import type { CollectionFilters } from "./CollectionsExplorer";

type CollectionGridProps = {
  activeTab: string;
  filters: CollectionFilters;
  viewMode: "grid" | "list";
  currentPage: number;
  pageSize: number;
  onTotalChange: (total: number) => void;
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatSol(value: number): string {
  if (value === 0) return "— SOL";

  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} SOL`;
}

export default function CollectionGrid({
  activeTab,
  filters,
  viewMode,
  currentPage,
  pageSize,
  onTotalChange,
}: CollectionGridProps) {
  const { data: collections = [], isPending, isError } = useCollections();

  const filteredCollections = useMemo(() => {
    return collections
      .filter((collection) => {
        const query = filters.search.trim().toLowerCase();

        if (
          query &&
          !collection.name.toLowerCase().includes(query) &&
          !collection.creator.toLowerCase().includes(query)
        ) {
          return false;
        }

        if (
          (activeTab === "Verified" || filters.status === "verified") &&
          !collection.verified
        ) {
          return false;
        }

        if (
          (activeTab === "New" || filters.status === "new") &&
          !collection.isNew
        ) {
          return false;
        }

        if (filters.status === "trading" && !collection.activeTrading) {
          return false;
        }

        // Category filtering will be enabled when the API provides category.
        const collectionCategory = (
          collection as Collection & { category?: string }
        ).category;

        if (
          filters.category &&
          collectionCategory &&
          collectionCategory !== filters.category
        ) {
          return false;
        }

        if (
          filters.minPrice !== null &&
          collection.floorPrice < filters.minPrice
        ) {
          return false;
        }

        if (
          filters.maxPrice !== null &&
          collection.floorPrice > filters.maxPrice
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Until a trending field exists, use volume as a ranking signal.
        if (activeTab === "Trending") {
          return b.volume - a.volume;
        }

        switch (filters.sortBy) {
          case "Total Volume (Low to High)":
            return a.volume - b.volume;

          case "Floor Price (High to Low)":
            return b.floorPrice - a.floorPrice;

          case "Floor Price (Low to High)":
            return a.floorPrice - b.floorPrice;

          case "Recently Added":
            // The API currently returns collections newest first.
            // Preserve that order until createdAt is exposed in the response.
            return 0;

          case "Most Items":
            return b.items - a.items;

          case "Total Volume (High to Low)":
          default:
            return b.volume - a.volume;
        }
      });
  }, [collections, activeTab, filters]);

  useEffect(() => {
    onTotalChange(filteredCollections.length);
  }, [filteredCollections.length, onTotalChange]);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedCollections = filteredCollections.slice(
    startIndex,
    startIndex + pageSize,
  );

  if (isPending) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#030b19]"
          >
            <div className="aspect-[1.9/1] bg-white/5" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/10" />
              <div className="h-8 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 flex min-h-60 flex-col items-center justify-center rounded-xl border border-red-500/20 bg-[#030b19] px-6 text-center">
        <p className="text-sm font-semibold text-white">
          Failed to load collections
        </p>
        <p className="mt-2 max-w-sm text-xs text-blue-200/70">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {paginatedCollections.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginatedCollections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#030b19] p-3 transition hover:border-blue-500/40 sm:gap-5 sm:p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                  <Image
                    src={collection.banner || "/images/n.png"}
                    alt={collection.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-white">
                      {collection.name}
                    </h3>

                    {collection.verified && (
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-300">
                        Verified
                      </span>
                    )}

                    {collection.isNew && (
                      <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs text-purple-300">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-sm text-blue-200/60">
                    by {collection.creator}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-blue-100/70 sm:text-sm">
                    <span>{formatNumber(collection.items)} items</span>

                    <span>
                      Floor:{" "}
                      <span className="font-medium text-white">
                        {formatSol(collection.floorPrice)}
                      </span>
                    </span>

                    <span>
                      Volume:{" "}
                      <span className="font-medium text-white">
                        {formatCompactNumber(collection.volume)} SOL
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/collections/${collection.slug}`;
                  }}
                  className="shrink-0 rounded-lg border border-blue-500/30 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/10 sm:px-4 sm:text-sm"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-blue-500/30 bg-[#030b19] px-6 text-center">
          <p className="text-sm font-semibold text-white">
            No collections found
          </p>
          <p className="mt-2 max-w-sm text-xs text-blue-200/70">
            Try changing your search, category, status, or price range.
          </p>
        </div>
      )}
    </div>
  );
}
