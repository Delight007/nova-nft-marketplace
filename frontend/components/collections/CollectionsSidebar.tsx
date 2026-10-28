// "use client";

// import Slider from "@mui/material/Slider";
// import { useState } from "react";
// import { GrGamepad } from "react-icons/gr";

// import {
//   FiActivity,
//   FiCamera,
//   FiCheckCircle,
//   FiChevronDown,
//   FiCircle,
//   FiGrid,
//   FiImage,
//   FiMusic,
//   FiSearch,
//   FiSliders,
//   FiX,
// } from "react-icons/fi";

// type StatusFilter = "all" | "verified" | "new" | "trading";

// type Category =
//   | "Art"
//   | "Gaming"
//   | "PFP"
//   | "Utility"
//   | "Photography"
//   | "Sports"
//   | "Music"
//   | "Other";

// const categories: {
//   name: Category;
//   icon: React.ReactNode;
// }[] = [
//   {
//     name: "Art",
//     icon: <FiImage />,
//   },
//   {
//     name: "Gaming",
//     icon: <GrGamepad />,
//   },
//   {
//     name: "PFP",
//     icon: <FiCircle />,
//   },
//   {
//     name: "Utility",
//     icon: <FiSliders />,
//   },
//   {
//     name: "Photography",
//     icon: <FiCamera />,
//   },
//   {
//     name: "Sports",
//     icon: <FiActivity />,
//   },
//   {
//     name: "Music",
//     icon: <FiMusic />,
//   },
//   {
//     name: "Other",
//     icon: <FiGrid />,
//   },
// ];

// const sortOptions = [
//   "Total Volume (High to Low)",
//   "Total Volume (Low to High)",
//   "Floor Price (High to Low)",
//   "Floor Price (Low to High)",
//   "Recently Added",
//   "Most Items",
// ];

// export default function CollectionsSidebar() {
//   const [search, setSearch] = useState("");

//   const [status, setStatus] = useState<StatusFilter>("all");

//   const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

//   const [minPrice, setMinPrice] = useState("");

//   const [maxPrice, setMaxPrice] = useState("");

//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     null,
//   );

//   const [sortBy, setSortBy] = useState(sortOptions[0]);

//   const [showStatus, setShowStatus] = useState(true);
//   const [showPrice, setShowPrice] = useState(true);
//   const [showCategory, setShowCategory] = useState(true);
//   const [showSort, setShowSort] = useState(true);

//   const handlePriceChange = (_event: Event, newValue: number | number[]) => {
//     if (!Array.isArray(newValue)) return;

//     setPriceRange(newValue);

//     setMinPrice(String(newValue[0]));
//     setMaxPrice(String(newValue[1]));
//   };

//   const handleMinPriceChange = (value: string) => {
//     setMinPrice(value);

//     const parsed = Number(value);

//     if (!Number.isNaN(parsed)) {
//       setPriceRange((current) => [Math.min(parsed, current[1]), current[1]]);
//     }
//   };

//   const handleMaxPriceChange = (value: string) => {
//     setMaxPrice(value);

//     const parsed = Number(value);

//     if (!Number.isNaN(parsed)) {
//       setPriceRange((current) => [current[0], Math.max(parsed, current[0])]);
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setStatus("all");
//     setPriceRange([0, 100]);
//     setMinPrice("");
//     setMaxPrice("");
//     setSelectedCategory(null);
//     setSortBy(sortOptions[0]);
//   };

//   const applyFilters = () => {
//     console.log({
//       search,
//       status,
//       minPrice,
//       maxPrice,
//       category: selectedCategory,
//       sortBy,
//     });
//   };

//   return (
//     <aside className="w-full">
//       <div className="sticky top-5 rounded-xl border border-blue-500/30 bg-[#030b19] p-4">
//         {/* =========================================================
//             HEADER
//         ========================================================== */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <FiSliders className="h-4 w-4 text-violet-400" />

//             <h2 className="text-[13px] font-semibold text-white">Filters</h2>
//           </div>

//           <button
//             type="button"
//             onClick={clearFilters}
//             className="text-[10px] text-blue-300 transition hover:text-cyan-300"
//           >
//             Clear all
//           </button>
//         </div>

//         {/* =========================================================
//             SEARCH
//         ========================================================== */}
//         <div className="relative mt-3">
//           <FiSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-300" />

//           <input
//             type="text"
//             value={search}
//             onChange={(event) => setSearch(event.target.value)}
//             placeholder="Search collections..."
//             className="h-8.5 w-full rounded-lg border border-blue-500/40 bg-[#020813] pl-9 pr-8 text-[10px] text-white outline-none placeholder:text-blue-300/60 focus:border-violet-500"
//           />

//           {search && (
//             <button
//               type="button"
//               onClick={() => setSearch("")}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
//               aria-label="Clear search"
//             >
//               <FiX className="h-3 w-3" />
//             </button>
//           )}
//         </div>

//         {/* =========================================================
//             STATUS
//         ========================================================== */}
//         <FilterSection
//           title="Status"
//           open={showStatus}
//           onToggle={() => setShowStatus((value) => !value)}
//         >
//           <div className="space-y-2.5">
//             <StatusOption
//               label="All Collections"
//               checked={status === "all"}
//               onClick={() => setStatus("all")}
//               activeIcon
//             />

//             <StatusOption
//               label="Verified Only"
//               checked={status === "verified"}
//               onClick={() => setStatus("verified")}
//             />

//             <StatusOption
//               label="New Collections"
//               checked={status === "new"}
//               onClick={() => setStatus("new")}
//             />

//             <StatusOption
//               label="Active Trading"
//               checked={status === "trading"}
//               onClick={() => setStatus("trading")}
//             />
//           </div>
//         </FilterSection>

//         {/* =========================================================
//             PRICE RANGE
//         ========================================================== */}
//         <FilterSection
//           title="Price Range"
//           open={showPrice}
//           onToggle={() => setShowPrice((value) => !value)}
//         >
//           <div className="px-1">
//             <Slider
//               value={priceRange}
//               onChange={handlePriceChange}
//               min={0}
//               max={100}
//               step={1}
//               sx={{
//                 color: "#8b5cf6",
//                 height: 3,

//                 "& .MuiSlider-rail": {
//                   opacity: 1,
//                   backgroundColor: "#10213b",
//                 },

//                 "& .MuiSlider-track": {
//                   border: "none",
//                   background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
//                 },

//                 "& .MuiSlider-thumb": {
//                   width: 10,
//                   height: 10,
//                   backgroundColor: "#8b5cf6",
//                   boxShadow: "0 0 0 2px rgba(139,92,246,.15)",

//                   "&:hover": {
//                     boxShadow: "0 0 0 5px rgba(139,92,246,.12)",
//                   },
//                 },
//               }}
//             />
//           </div>

//           <div className="mt-2 grid grid-cols-[1fr_1fr_42px] gap-2">
//             {/* Min */}
//             <div className="relative">
//               <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-blue-300">
//                 ◎
//               </span>

//               <input
//                 type="number"
//                 min="0"
//                 value={minPrice}
//                 onChange={(event) => handleMinPriceChange(event.target.value)}
//                 placeholder="Min"
//                 className="h-7.5 w-full rounded-md border border-blue-500/30 bg-[#020813] pl-6 pr-2 text-[9px] text-white outline-none placeholder:text-blue-300/50 focus:border-violet-500"
//               />
//             </div>

//             {/* Max */}
//             <div className="relative">
//               <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-blue-300">
//                 ◎
//               </span>

//               <input
//                 type="number"
//                 min="0"
//                 value={maxPrice}
//                 onChange={(event) => handleMaxPriceChange(event.target.value)}
//                 placeholder="Max"
//                 className="h-7.5 w-full rounded-md border border-blue-500/30 bg-[#020813] pl-6 pr-2 text-[9px] text-white outline-none placeholder:text-blue-300/50 focus:border-violet-500"
//               />
//             </div>

//             {/* Currency */}
//             <div className="flex h-7.5 items-center justify-center rounded-md border border-blue-500/30 bg-[#020813] text-[9px] text-blue-200">
//               SOL
//             </div>
//           </div>
//         </FilterSection>

//         {/* =========================================================
//             CATEGORY
//         ========================================================== */}
//         <FilterSection
//           title="Category"
//           open={showCategory}
//           onToggle={() => setShowCategory((value) => !value)}
//         >
//           <div className="grid grid-cols-1 gap-2">
//             {categories.map((category) => {
//               const active = selectedCategory === category.name;

//               return (
//                 <button
//                   key={category.name}
//                   type="button"
//                   onClick={() =>
//                     setSelectedCategory(active ? null : category.name)
//                   }
//                   className={`flex items-center gap-2 rounded-md px-1 py-0.5 text-left text-[10px] transition ${
//                     active ? "text-cyan-300" : "text-blue-100 hover:text-white"
//                   }`}
//                 >
//                   <span
//                     className={`flex h-4 w-4 items-center justify-center ${
//                       active ? "text-cyan-400" : "text-blue-300"
//                     }`}
//                   >
//                     {category.icon}
//                   </span>

//                   {category.name}
//                 </button>
//               );
//             })}
//           </div>
//         </FilterSection>

//         {/* =========================================================
//             SORT BY
//         ========================================================== */}
//         <FilterSection
//           title="Sort By"
//           open={showSort}
//           onToggle={() => setShowSort((value) => !value)}
//         >
//           <div className="relative">
//             <select
//               value={sortBy}
//               onChange={(event) => setSortBy(event.target.value)}
//               className="h-7.5 w-full appearance-none rounded-md border border-blue-500/50 bg-[#020813] px-3 pr-8 text-[9px] text-white outline-none focus:border-violet-500"
//             >
//               {sortOptions.map((option) => (
//                 <option
//                   key={option}
//                   value={option}
//                   className="bg-[#071120] text-white"
//                 >
//                   {option}
//                 </option>
//               ))}
//             </select>

//             <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-blue-300" />
//           </div>
//         </FilterSection>

//         {/* =========================================================
//             APPLY FILTERS
//         ========================================================== */}
//         <button
//           type="button"
//           onClick={applyFilters}
//           className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-[11px] font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </aside>
//   );
// }

// /* ================================================================
//    FILTER SECTION
// ================================================================ */

// function FilterSection({
//   title,
//   open,
//   onToggle,
//   children,
// }: {
//   title: string;
//   open: boolean;
//   onToggle: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="border-b border-white/10 py-3.5 last:border-b-0">
//       <button
//         type="button"
//         onClick={onToggle}
//         className="flex w-full items-center justify-between text-left"
//       >
//         <span className="text-[11px] font-semibold text-white">{title}</span>

//         <FiChevronDown
//           className={`h-3 w-3 text-blue-300 transition-transform duration-200 ${
//             open ? "rotate-0" : "-rotate-90"
//           }`}
//         />
//       </button>

//       {open && <div className="mt-3">{children}</div>}
//     </div>
//   );
// }

// /* ================================================================
//    STATUS OPTION
// ================================================================ */

// function StatusOption({
//   label,
//   checked,
//   onClick,
//   activeIcon = false,
// }: {
//   label: string;
//   checked: boolean;
//   onClick: () => void;
//   activeIcon?: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="flex w-full items-center gap-2 text-left"
//     >
//       <span
//         className={`flex h-4 w-4 items-center justify-center rounded-[3px] border transition ${
//           checked
//             ? "border-violet-500 bg-violet-500"
//             : "border-blue-400/80 bg-transparent"
//         }`}
//       >
//         {checked && (
//           <FiCheckCircle
//             className={`h-3 w-3 ${activeIcon ? "text-white" : "text-white"}`}
//           />
//         )}
//       </span>

//       <span
//         className={`text-[10px] ${checked ? "text-blue-50" : "text-blue-200"}`}
//       >
//         {label}
//       </span>
//     </button>
//   );
// }

"use client";

import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiCamera,
  FiCheckCircle,
  FiChevronDown,
  FiCircle,
  FiGrid,
  FiImage,
  FiMusic,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";
import { GrGamepad } from "react-icons/gr";

import type { CollectionFilters } from "./CollectionsExplorer";

type StatusFilter = CollectionFilters["status"];

type Category =
  | "Art"
  | "Gaming"
  | "PFP"
  | "Utility"
  | "Photography"
  | "Sports"
  | "Music"
  | "Other";

const categories: { name: Category; icon: React.ReactNode }[] = [
  { name: "Art", icon: <FiImage /> },
  { name: "Gaming", icon: <GrGamepad /> },
  { name: "PFP", icon: <FiCircle /> },
  { name: "Utility", icon: <FiSliders /> },
  { name: "Photography", icon: <FiCamera /> },
  { name: "Sports", icon: <FiActivity /> },
  { name: "Music", icon: <FiMusic /> },
  { name: "Other", icon: <FiGrid /> },
];

const sortOptions = [
  "Total Volume (High to Low)",
  "Total Volume (Low to High)",
  "Floor Price (High to Low)",
  "Floor Price (Low to High)",
  "Recently Added",
  "Most Items",
];

type Props = {
  appliedFilters: CollectionFilters;
  onApplyFilters: (filters: CollectionFilters) => void;
};

export default function CollectionsSidebar({
  appliedFilters,
  onApplyFilters,
}: Props) {
  const [search, setSearch] = useState(appliedFilters.search);
  const [status, setStatus] = useState<StatusFilter>(appliedFilters.status);
  const [priceRange, setPriceRange] = useState<number[]>([
    appliedFilters.minPrice ?? 0,
    appliedFilters.maxPrice ?? 100,
  ]);
  const [minPrice, setMinPrice] = useState(
    appliedFilters.minPrice?.toString() ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    appliedFilters.maxPrice?.toString() ?? "",
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    (appliedFilters.category as Category | null) ?? null,
  );
  const [sortBy, setSortBy] = useState(appliedFilters.sortBy);

  const [showStatus, setShowStatus] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showSort, setShowSort] = useState(true);

  useEffect(() => {
    setSearch(appliedFilters.search);
    setStatus(appliedFilters.status);
    setPriceRange([
      appliedFilters.minPrice ?? 0,
      appliedFilters.maxPrice ?? 100,
    ]);
    setMinPrice(appliedFilters.minPrice?.toString() ?? "");
    setMaxPrice(appliedFilters.maxPrice?.toString() ?? "");
    setSelectedCategory((appliedFilters.category as Category | null) ?? null);
    setSortBy(appliedFilters.sortBy);
  }, [appliedFilters]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;

    setPriceRange(newValue);
    setMinPrice(String(newValue[0]));
    setMaxPrice(String(newValue[1]));
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);

    if (value === "") {
      setPriceRange((current) => [0, current[1]]);
      return;
    }

    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      setPriceRange((current) => [Math.min(parsed, current[1]), current[1]]);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);

    if (value === "") {
      setPriceRange((current) => [current[0], 100]);
      return;
    }

    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      setPriceRange((current) => [current[0], Math.max(parsed, current[0])]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriceRange([0, 100]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory(null);
    setSortBy(sortOptions[0]);

    onApplyFilters({
      search: "",
      status: "all",
      minPrice: null,
      maxPrice: null,
      category: null,
      sortBy: sortOptions[0],
    });
  };

  const applyFilters = () => {
    const parsedMin = minPrice.trim() === "" ? null : Number(minPrice);
    const parsedMax = maxPrice.trim() === "" ? null : Number(maxPrice);

    onApplyFilters({
      search: search.trim(),
      status,
      minPrice:
        parsedMin !== null && Number.isFinite(parsedMin) ? parsedMin : null,
      maxPrice:
        parsedMax !== null && Number.isFinite(parsedMax) ? parsedMax : null,
      category: selectedCategory,
      sortBy,
    });
  };

  return (
    <aside className="w-full">
      <div className="sticky top-5 rounded-xl border border-blue-500/30 bg-[#030b19] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiSliders className="h-4 w-4 text-violet-400" />
            <h2 className="text-[13px] font-semibold text-white">Filters</h2>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-[10px] text-blue-300 transition hover:text-cyan-300"
          >
            Clear all
          </button>
        </div>

        <div className="relative mt-3">
          <FiSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-300" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search collections..."
            className="h-8.5 w-full rounded-lg border border-blue-500/40 bg-[#020813] pl-9 pr-8 text-[10px] text-white outline-none placeholder:text-blue-300/60 focus:border-violet-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
              aria-label="Clear search"
            >
              <FiX className="h-3 w-3" />
            </button>
          )}
        </div>

        <FilterSection
          title="Status"
          open={showStatus}
          onToggle={() => setShowStatus((value) => !value)}
        >
          <div className="space-y-2.5">
            <StatusOption
              label="All Collections"
              checked={status === "all"}
              onClick={() => setStatus("all")}
              activeIcon
            />
            <StatusOption
              label="Verified Only"
              checked={status === "verified"}
              onClick={() => setStatus("verified")}
            />
            <StatusOption
              label="New Collections"
              checked={status === "new"}
              onClick={() => setStatus("new")}
            />
            <StatusOption
              label="Active Trading"
              checked={status === "trading"}
              onClick={() => setStatus("trading")}
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Price Range"
          open={showPrice}
          onToggle={() => setShowPrice((value) => !value)}
        >
          <div className="px-1">
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#8b5cf6",
                height: 3,
                "& .MuiSlider-rail": {
                  opacity: 1,
                  backgroundColor: "#10213b",
                },
                "& .MuiSlider-track": {
                  border: "none",
                  background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                },
                "& .MuiSlider-thumb": {
                  width: 10,
                  height: 10,
                  backgroundColor: "#8b5cf6",
                  boxShadow: "0 0 0 2px rgba(139,92,246,.15)",
                  "&:hover": {
                    boxShadow: "0 0 0 5px rgba(139,92,246,.12)",
                  },
                },
              }}
            />
          </div>

          <div className="mt-2 grid grid-cols-[1fr_1fr_42px] gap-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-blue-300">
                ◎
              </span>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => handleMinPriceChange(event.target.value)}
                placeholder="Min"
                className="h-7.5 w-full rounded-md border border-blue-500/30 bg-[#020813] pl-6 pr-2 text-[9px] text-white outline-none placeholder:text-blue-300/50 focus:border-violet-500"
              />
            </div>

            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-blue-300">
                ◎
              </span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => handleMaxPriceChange(event.target.value)}
                placeholder="Max"
                className="h-7.5 w-full rounded-md border border-blue-500/30 bg-[#020813] pl-6 pr-2 text-[9px] text-white outline-none placeholder:text-blue-300/50 focus:border-violet-500"
              />
            </div>

            <div className="flex h-7.5 items-center justify-center rounded-md border border-blue-500/30 bg-[#020813] text-[9px] text-blue-200">
              SOL
            </div>
          </div>

          <p className="mt-1 text-[9px] text-blue-300/60">
            Enter a floor price range in SOL (0–100).
          </p>
        </FilterSection>

        <FilterSection
          title="Category"
          open={showCategory}
          onToggle={() => setShowCategory((value) => !value)}
        >
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(active ? null : category.name)
                  }
                  className={`flex items-center gap-2 rounded-md px-1 py-0.5 text-left text-[10px] transition ${
                    active ? "text-cyan-300" : "text-blue-100 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center ${
                      active ? "text-cyan-400" : "text-blue-300"
                    }`}
                  >
                    {category.icon}
                  </span>
                  {category.name}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection
          title="Sort By"
          open={showSort}
          onToggle={() => setShowSort((value) => !value)}
        >
          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-7.5 w-full appearance-none rounded-md border border-blue-500/50 bg-[#020813] px-3 pr-8 text-[9px] text-white outline-none focus:border-violet-500"
            >
              {sortOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-[#071120] text-white"
                >
                  {option}
                </option>
              ))}
            </select>

            <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-blue-300" />
          </div>
        </FilterSection>

        <button
          type="button"
          onClick={applyFilters}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-[11px] font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/10 py-3.5 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-semibold text-white">{title}</span>
        <FiChevronDown
          className={`h-3 w-3 text-blue-300 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function StatusOption({
  label,
  checked,
  onClick,
  activeIcon = false,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  activeIcon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 text-left"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-[3px] border transition ${
          checked
            ? "border-violet-500 bg-violet-500"
            : "border-blue-400/80 bg-transparent"
        }`}
      >
        {checked && (
          <FiCheckCircle
            className={`h-3 w-3 ${activeIcon ? "text-white" : "text-white"}`}
          />
        )}
      </span>

      <span
        className={`text-[10px] ${checked ? "text-blue-50" : "text-blue-200"}`}
      >
        {label}
      </span>
    </button>
  );
}
