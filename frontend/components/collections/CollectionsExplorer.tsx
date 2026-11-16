// "use client";

// import { useState } from "react";
// import CollectionGrid from "./CollectionGrid";
// import CollectionsSidebar from "./CollectionsSidebar";
// import CollectionsTabs from "./CollectionsTabs";
// export default function CollectionsExplorer() {
//   const [activeTab, setActiveTab] = useState("All Collections");

//   return (
//     <section className=" container relative overflow-hidden border-b border-white/10 bg-[#020812]">
//       <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 lg:py-10">
//         <div className="grid grid-cols-[256px_minmax(0,1fr)] gap-8">
//           {/* Sidebar */}
//           <CollectionsSidebar />

//           {/* Main content */}
//           <div className="min-w-0">
//             <CollectionsTabs activeTab={activeTab} onTabChange={setActiveTab} />

//             <CollectionGrid activeTab={activeTab} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { FiSliders } from "react-icons/fi";
import CollectionGrid from "./CollectionGrid";
import CollectionsSidebar from "./CollectionsSidebar";
import CollectionsTabs from "./CollectionsTabs";

export type CollectionFilters = {
  search: string;
  status: "all" | "verified" | "new" | "trading";
  minPrice: number | null;
  maxPrice: number | null;
  category: string | null;
  sortBy: string;
};

const defaultFilters: CollectionFilters = {
  search: "",
  status: "all",
  minPrice: null,
  maxPrice: null,
  category: null,
  sortBy: "Total Volume (High to Low)",
};

const PAGE_SIZE = 8;

export default function CollectionsExplorer() {
  const [activeTab, setActiveTab] = useState("All Collections");
  const [filters, setFilters] = useState<CollectionFilters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCollections, setTotalCollections] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCollections / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="container relative overflow-hidden border-b border-white/10 bg-[#020812]">
      <div className="mx-auto max-w-7xl px-4 py-5 motion-safe:animate-[nova-fade-up_400ms_ease-out_both] sm:px-6 lg:px-10 lg:py-10">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((open) => !open)}
          aria-expanded={mobileFiltersOpen}
          aria-controls="collections-mobile-filters"
          className="mb-4 flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-[#030b19] px-4 text-sm text-white lg:hidden"
        >
          <span className="flex items-center gap-2">
            <FiSliders className="text-violet-400" />
            Collection filters
          </span>
          <span className="text-xs text-slate-400">
            {mobileFiltersOpen ? "Hide" : "Show"}
          </span>
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[256px_minmax(0,1fr)]">
          <div
            id="collections-mobile-filters"
            className={`${mobileFiltersOpen ? "block" : "hidden"} min-w-0 lg:block`}
          >
            <CollectionsSidebar
              appliedFilters={filters}
              onApplyFilters={(nextFilters) => {
                setFilters(nextFilters);
                setMobileFiltersOpen(false);
              }}
            />
          </div>

          <div className="min-w-0">
            <CollectionsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalCollections={totalCollections}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            <CollectionGrid
              activeTab={activeTab}
              filters={filters}
              viewMode={viewMode}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onTotalChange={setTotalCollections}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
