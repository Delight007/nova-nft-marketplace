"use client";

import MarketplaceFilters, {
  type MarketplaceSort,
  type MarketplaceView,
} from "./MarketplaceFilters";
import MarketplaceSidebar from "./marketplaceSidebar";
import NFTGrid from "./NFTGrid";
import { useCollections } from "@/hooks/use-Collections";
import { useMarketplaceNFTs } from "@/hooks/use-marketPlace";
import { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

const PAGE_SIZE = 24;
const MAX_PRICE = 500;

export default function MarketplaceContent() {
  const [category, setCategory] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<MarketplaceSort>("recent");
  const [view, setView] = useState<MarketplaceView>("grid");
  const [search, setSearch] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    [],
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSaleTypes, setSelectedSaleTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    MAX_PRICE,
  ]);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: collections = [] } = useCollections();

  const statuses =
    selectedSaleTypes.includes("fixed-price")
      ? ["listed"]
      : selectedStatuses;
  const { data, isPending, isError, error } = useMarketplaceNFTs({
    page,
    limit: PAGE_SIZE,
    search,
    category,
    collection: selectedCollections.join(","),
    verified: verifiedOnly,
    status: statuses,
    minPrice: priceRange[0] > 0 ? priceRange[0] : null,
    maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : null,
    sort: sortBy,
  });

  const resetFilters = () => {
    setCategory("All");
    setVerifiedOnly(false);
    setSelectedCollections([]);
    setSelectedStatuses([]);
    setSelectedSaleTypes([]);
    setPriceRange([0, MAX_PRICE]);
    setSearch("");
    setPage(1);
  };

  const changeFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <MarketplaceFilters
        category={category}
        onCategoryChange={(value) => changeFilter(setCategory, value)}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={(value) =>
          changeFilter(setVerifiedOnly, value)
        }
        sortBy={sortBy}
        onSortChange={(value) => changeFilter(setSortBy, value)}
        view={view}
        onViewChange={setView}
      />

      <section className="container mx-auto px-6 py-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="lg:block">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 text-sm text-white lg:hidden"
            >
              <span className="flex items-center gap-2">
                <FiSliders className="text-purple-400" />
                Filters
              </span>
              <span className="text-xs text-slate-400">
                {mobileFiltersOpen ? "Hide" : "Show"}
              </span>
            </button>
            <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
              <MarketplaceSidebar
                collections={collections}
                selectedCollections={selectedCollections}
                onCollectionsChange={(value) =>
                  changeFilter(setSelectedCollections, value)
                }
                selectedStatuses={selectedStatuses}
                onStatusesChange={(value) =>
                  changeFilter(setSelectedStatuses, value)
                }
                selectedSaleTypes={selectedSaleTypes}
                onSaleTypesChange={(value) =>
                  changeFilter(setSelectedSaleTypes, value)
                }
                minPrice={priceRange[0]}
                maxPrice={priceRange[1]}
                onPriceRangeChange={(value) =>
                  changeFilter(setPriceRange, value)
                }
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Explore NFTs
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {data
                    ? `${data.total.toLocaleString()} NFTs available`
                    : "Discover unique digital assets on Solana"}
                </p>
              </div>
              <label className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-[#080d1b] px-3 py-2.5 text-slate-500 focus-within:border-purple-500/50">
                <FiSearch className="shrink-0" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    changeFilter(setSearch, event.target.value)
                  }
                  placeholder="Search NFTs or collections"
                  aria-label="Search NFTs or collections"
                  className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                />
              </label>
            </div>

            {isPending ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#050b17]"
                  >
                    <div className="aspect-[16/10] bg-white/5" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-2/3 rounded bg-white/10" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-6 text-sm text-red-300"
              >
                {error instanceof Error
                  ? error.message
                  : "Unable to load marketplace NFTs."}
              </div>
            ) : data?.nfts.length ? (
              <>
                <NFTGrid nfts={data.nfts} view={view} />
                {data.totalPages > 1 && (
                  <nav
                    aria-label="Marketplace pages"
                    className="mt-8 flex items-center justify-center gap-4"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((current) => current - 1)}
                      disabled={page <= 1}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-400">
                      Page {data.page} of {data.totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((current) => current + 1)}
                      disabled={page >= data.totalPages}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-white/10 bg-[#050b17] p-10 text-center">
                <h3 className="text-base font-semibold text-white">
                  No NFTs found
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg border border-purple-500/30 px-4 py-2 text-sm text-purple-200 hover:bg-purple-500/10"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
