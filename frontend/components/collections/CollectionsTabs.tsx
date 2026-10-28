// "use client";

// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import { FiGrid, FiList } from "react-icons/fi";

// type CollectionsTabsProps = {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// };

// const tabs = ["All Collections", "Verified", "Trending", "New"];

// export default function CollectionsTabs({
//   activeTab,
//   onTabChange,
// }: CollectionsTabsProps) {
//   return (
//     <div className="flex min-h-[42px] items-center justify-between border-b border-white/10">
//       {/* Tabs */}
//       <div className="flex h-full items-center gap-7">
//         {tabs.map((tab) => {
//           const active = activeTab === tab;

//           return (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => onTabChange(tab)}
//               className={`relative flex h-full items-center px-1 text-[13px] transition ${
//                 active
//                   ? "font-semibold text-white"
//                   : "text-blue-200/80 hover:text-white"
//               }`}
//             >
//               {tab}

//               {active && (
//                 <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400" />
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Right controls */}
//       <div className="flex items-center gap-4">
//         <div className="flex h-8 overflow-hidden rounded-lg border border-blue-500/30 bg-[#07152a]">
//           <button
//             type="button"
//             className="flex w-9 items-center justify-center bg-blue-600/30 text-white"
//             aria-label="Grid view"
//           >
//             <FiGrid className="h-4 w-4" />
//           </button>

//           <button
//             type="button"
//             className="flex w-9 items-center justify-center text-blue-300 transition hover:text-white"
//             aria-label="List view"
//           >
//             <FiList className="h-4 w-4" />
//           </button>
//         </div>

//         <span className="hidden text-[11px] text-blue-200 md:block">
//           Showing 1 - 12 of 124 collections
//         </span>

//         <div className="flex items-center gap-1">
//           <button
//             type="button"
//             className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white"
//             aria-label="Previous page"
//           >
//             <FaChevronLeft className="h-2.5 w-2.5" />
//           </button>

//           <button
//             type="button"
//             className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white"
//             aria-label="Next page"
//           >
//             <FaChevronRight className="h-2.5 w-2.5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiGrid, FiList } from "react-icons/fi";

type CollectionsTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalCollections: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const tabs = ["All Collections", "Verified", "Trending", "New"];

export default function CollectionsTabs({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  totalCollections,
  currentPage,
  totalPages,
  onPageChange,
}: CollectionsTabsProps) {
  const pageSize = 8;
  const firstItem =
    totalCollections === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalCollections);

  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex h-10 items-center gap-5 overflow-x-auto sm:gap-7">
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`relative flex h-full shrink-0 items-center px-1 text-[13px] transition ${
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

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center rounded-lg border border-[#1b2e4c] bg-[#071326] p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md p-2 transition ${
              viewMode === "grid"
                ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
                : "text-slate-500 hover:text-white"
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <FiGrid size={14} />
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`rounded-md p-2 transition ${
              viewMode === "list"
                ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
                : "text-slate-500 hover:text-white"
            }`}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <FiList size={14} />
          </button>
        </div>

        <span className="text-[10px] text-blue-200 md:text-[11px]">
          Showing {firstItem}–{lastItem} of {totalCollections}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            <FaChevronLeft className="h-2.5 w-2.5" />
          </button>

          <span className="min-w-8 text-center text-[10px] text-blue-200">
            {currentPage}/{totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 text-blue-200 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            <FaChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
