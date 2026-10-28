// "use client";

// import { useState } from "react";

// import { FaChevronDown, FaList, FaSearch, FaThLarge } from "react-icons/fa";

// import ProfileNftCard from "./profileNftCard";

// const nfts = [
//   {
//     id: "#1189",
//     name: "Cyber Soul #1189",
//     collection: "Neon Realms",
//     price: "8.3 SOL",
//     image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
//   },
//   {
//     id: "#2047",
//     name: "Floating Island #2047",
//     collection: "Sky Islands",
//     price: "12.5 SOL",
//     image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
//   },
//   {
//     id: "#9271",
//     name: "Ape #9271",
//     collection: "Ape Society",
//     price: "15.0 SOL",
//     image: "https://images.unsplash.com/photo-1634193295627-1cdddf751b4f",
//     rarity: "Rarity",
//   },
//   {
//     id: "#331",
//     name: "Rebirth #331",
//     collection: "The Forgotten",
//     price: "6.7 SOL",
//     image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988",
//   },
//   {
//     id: "#903",
//     name: "The Last Light #903",
//     collection: "Aurora",
//     price: "9.2 SOL",
//     image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
//   },
//   {
//     id: "#4210",
//     name: "Neon City #4210",
//     collection: "Pixel Nomad",
//     price: "3.5 SOL",
//     image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
//   },
//   {
//     id: "#7752",
//     name: "Guardian #7752",
//     collection: "CryptoBeasts",
//     price: "7.8 SOL",
//     image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce",
//   },
//   {
//     id: "#6601",
//     name: "Lost in Space #6601",
//     collection: "Void Collective",
//     price: "4.2 SOL",
//     image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2",
//   },
// ];

// export default function CollectedNfts() {
//   const [search, setSearch] = useState("");

//   const filteredNfts = nfts.filter((nft) =>
//     `${nft.name} ${nft.collection}`
//       .toLowerCase()
//       .includes(search.toLowerCase()),
//   );

//   return (
//     <section className="py-5">
//       {/* TITLE */}
//       <div className="mb-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
//         <div>
//           <div className="flex items-center gap-3">
//             <h2 className="text-xl font-semibold">Collected NFTs</h2>

//             <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300">
//               24
//             </span>
//           </div>

//           <p className="mt-2 text-sm text-slate-500">
//             NFTs you own across all collections.
//           </p>
//         </div>

//         {/* CONTROLS */}
//         <div className="flex flex-wrap items-center gap-3">
//           {/* SEARCH */}
//           <div className="flex h-10 w-full items-center rounded-xl border border-blue-500/20 bg-[#041127] px-3 sm:w-[200px]">
//             <FaSearch className="mr-3 text-xs text-slate-500" />

//             <input
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder="Search your NFTs..."
//               className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
//             />
//           </div>

//           {/* COLLECTION */}
//           <button className="flex h-10 items-center gap-8 rounded-xl border border-blue-500/20 bg-[#041127] px-4 text-xs text-slate-300">
//             All Collections
//             <FaChevronDown className="text-[10px] text-slate-500" />
//           </button>

//           {/* SORT */}
//           <button className="flex h-10 items-center gap-6 rounded-xl border border-blue-500/20 bg-[#041127] px-4 text-xs text-slate-300">
//             Recently Received
//             <FaChevronDown className="text-[10px] text-slate-500" />
//           </button>

//           {/* VIEW */}
//           <div className="flex h-10 overflow-hidden rounded-xl border border-blue-500/20 bg-[#041127]">
//             <button className="flex w-10 items-center justify-center bg-purple-500/10 text-purple-400">
//               <FaThLarge />
//             </button>

//             <button className="flex w-10 items-center justify-center text-slate-500 transition hover:text-white">
//               <FaList />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* GRID */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//         {filteredNfts.map((nft) => (
//           <ProfileNftCard key={nft.id} nft={nft} />
//         ))}
//       </div>

//       {filteredNfts.length === 0 && (
//         <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/10">
//           <p className="text-sm text-slate-500">No NFTs found.</p>
//         </div>
//       )}
//     </section>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { FaChevronDown, FaList, FaSearch, FaThLarge } from "react-icons/fa";

import ProfileNftCard from "@/components/profile/profileNftCard";
import { useMyCollectedNFTs } from "@/hooks/use-my-collected-nfts";
import { useMyCreatedNFTs } from "@/hooks/use-my-created-nfts";
import { useMyListedNFTs } from "@/hooks/use-my-listed-nfts";

type NFTsMode = "collected" | "created" | "listed";

interface CollectedNftsProps {
  mode?: NFTsMode;
}

export default function CollectedNfts({
  mode = "collected",
}: CollectedNftsProps) {
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [view, setView] = useState<"grid" | "list">("grid");

  const collectedQuery = useMyCollectedNFTs(mode === "collected");
  const createdQuery = useMyCreatedNFTs(mode === "created");
  const listedQuery = useMyListedNFTs(mode === "listed");

  const activeQuery =
    mode === "collected"
      ? collectedQuery
      : mode === "created"
        ? createdQuery
        : listedQuery;

  const nfts = activeQuery.data?.nfts ?? [];
  const total = activeQuery.data?.total ?? 0;

  const collections = useMemo(() => {
    const unique = new Map<string, string>();

    nfts.forEach((nft) => {
      if (nft.collection) {
        unique.set(nft.collection.id, nft.collection.name);
      }
    });

    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [nfts]);

  const filteredNFTs = useMemo(() => {
    const result = nfts.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(search.toLowerCase()) ||
        nft.collection?.name.toLowerCase().includes(search.toLowerCase()) ||
        nft.mintAddress.toLowerCase().includes(search.toLowerCase());

      const matchesCollection =
        collectionFilter === "all" || nft.collection?.id === collectionFilter;

      return matchesSearch && matchesCollection;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "price-high":
          return Number(b.listing?.price ?? 0) - Number(a.listing?.price ?? 0);
        case "price-low":
          return Number(a.listing?.price ?? 0) - Number(b.listing?.price ?? 0);
        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [nfts, search, collectionFilter, sortBy]);

  const heading =
    mode === "collected"
      ? "Collected NFTs"
      : mode === "created"
        ? "Created NFTs"
        : "Listed NFTs";

  return (
    <section className="py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{heading}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {total} {total === 1 ? "NFT" : "NFTs"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`rounded-lg border p-2 ${
              view === "grid"
                ? "border-purple-500 bg-purple-500/15 text-white"
                : "border-white/10 text-slate-400"
            }`}
          >
            <FaThLarge />
          </button>

          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={`rounded-lg border p-2 ${
              view === "list"
                ? "border-purple-500 bg-purple-500/15 text-white"
                : "border-white/10 text-slate-400"
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
          <FaSearch className="shrink-0 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search NFTs..."
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="relative">
          <select
            value={collectionFilter}
            onChange={(event) => setCollectionFilter(event.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#071126] py-3 pl-4 pr-10 text-sm text-white outline-none sm:w-48"
          >
            <option value="all">All collections</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
          <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-[#071126] py-3 pl-4 pr-10 text-sm text-white outline-none sm:w-44"
          >
            <option value="recent">Most recent</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
            <option value="price-high">Price: high to low</option>
            <option value="price-low">Price: low to high</option>
          </select>
          <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
        </div>
      </div>

      {activeQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : activeQuery.isError ? (
        <div className="rounded-2xl border border-white/10 p-8 text-center">
          <p className="text-slate-300">Could not load your NFTs.</p>
          <button
            type="button"
            onClick={() => activeQuery.refetch()}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500"
          >
            Try again
          </button>
        </div>
      ) : filteredNFTs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
          <h3 className="text-lg font-semibold">
            {search || collectionFilter !== "all"
              ? "No matching NFTs"
              : mode === "collected"
                ? "No collected NFTs yet"
                : "No created NFTs yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {search || collectionFilter !== "all"
              ? "Try changing your search or collection filter."
              : mode === "collected"
                ? "NFTs you own will appear here."
                : "NFTs you create will appear here."}
          </p>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredNFTs.map((nft) => (
            <ProfileNftCard key={nft.id} nft={nft} view={view} />
          ))}
        </div>
      )}
    </section>
  );
}
