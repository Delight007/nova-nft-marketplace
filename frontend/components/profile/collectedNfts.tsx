"use client";

import { useState } from "react";

import { FaChevronDown, FaList, FaSearch, FaThLarge } from "react-icons/fa";

import ProfileNftCard from "./profileNftCard";

const nfts = [
  {
    id: "#1189",
    name: "Cyber Soul #1189",
    collection: "Neon Realms",
    price: "8.3 SOL",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
  },
  {
    id: "#2047",
    name: "Floating Island #2047",
    collection: "Sky Islands",
    price: "12.5 SOL",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
  },
  {
    id: "#9271",
    name: "Ape #9271",
    collection: "Ape Society",
    price: "15.0 SOL",
    image: "https://images.unsplash.com/photo-1634193295627-1cdddf751b4f",
    rarity: "Rarity",
  },
  {
    id: "#331",
    name: "Rebirth #331",
    collection: "The Forgotten",
    price: "6.7 SOL",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988",
  },
  {
    id: "#903",
    name: "The Last Light #903",
    collection: "Aurora",
    price: "9.2 SOL",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
  },
  {
    id: "#4210",
    name: "Neon City #4210",
    collection: "Pixel Nomad",
    price: "3.5 SOL",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
  },
  {
    id: "#7752",
    name: "Guardian #7752",
    collection: "CryptoBeasts",
    price: "7.8 SOL",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce",
  },
  {
    id: "#6601",
    name: "Lost in Space #6601",
    collection: "Void Collective",
    price: "4.2 SOL",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2",
  },
];

export default function CollectedNfts() {
  const [search, setSearch] = useState("");

  const filteredNfts = nfts.filter((nft) =>
    `${nft.name} ${nft.collection}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="py-5">
      {/* TITLE */}
      <div className="mb-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Collected NFTs</h2>

            <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-300">
              24
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            NFTs you own across all collections.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <div className="flex h-10 w-full items-center rounded-xl border border-blue-500/20 bg-[#041127] px-3 sm:w-[200px]">
            <FaSearch className="mr-3 text-xs text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your NFTs..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
            />
          </div>

          {/* COLLECTION */}
          <button className="flex h-10 items-center gap-8 rounded-xl border border-blue-500/20 bg-[#041127] px-4 text-xs text-slate-300">
            All Collections
            <FaChevronDown className="text-[10px] text-slate-500" />
          </button>

          {/* SORT */}
          <button className="flex h-10 items-center gap-6 rounded-xl border border-blue-500/20 bg-[#041127] px-4 text-xs text-slate-300">
            Recently Received
            <FaChevronDown className="text-[10px] text-slate-500" />
          </button>

          {/* VIEW */}
          <div className="flex h-10 overflow-hidden rounded-xl border border-blue-500/20 bg-[#041127]">
            <button className="flex w-10 items-center justify-center bg-purple-500/10 text-purple-400">
              <FaThLarge />
            </button>

            <button className="flex w-10 items-center justify-center text-slate-500 transition hover:text-white">
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredNfts.map((nft) => (
          <ProfileNftCard key={nft.id} nft={nft} />
        ))}
      </div>

      {filteredNfts.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/10">
          <p className="text-sm text-slate-500">No NFTs found.</p>
        </div>
      )}
    </section>
  );
}
