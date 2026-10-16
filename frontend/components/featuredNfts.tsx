"use client";

import LiveActivities from "@/components/liveActivities";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { SiSolana } from "react-icons/si";

const featuredNFTs = [
  {
    id: 1,
    name: "Cyber Soul #1189",
    collection: "Neon Realms",
    price: "8.3 SOL",
    usd: "$1,242",
    image: "/images/n.png",
  },
  {
    id: 2,
    name: "Sky Islands #2047",
    collection: "Sky Islands",
    price: "12.5 SOL",
    usd: "$1,876",
    image: "/images/n2.png",
  },
  {
    id: 3,
    name: "Ape Society #5271",
    collection: "Ape Society",
    price: "15.0 SOL",
    usd: "$2,255",
    image: "/images/n3.jpg",
  },
  {
    id: 4,
    name: "The Forgotten #331",
    collection: "Void Studio",
    price: "6.7 SOL",
    usd: "$1,004",
    image: "/images/n.png",
  },
];

export default function FeaturedNFTs() {
  const [favorites, setFavorites] = useState<number[]>([]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="border-b border-white/10 bg-[#030917]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 px-6 py-5 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:px-10">
        <div className="min-w-0 rounded-xl ">
          {/* Section heading */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Featured NFTs</h2>

              <p className="text-xs text-slate-400">
                Handpicked by our team. Discover the most promising assets in
                the ecosystem.
              </p>
            </div>

            <Link
              href="/explore"
              className="flex shrink-0 items-center gap-2 text-xs text-blue-400 transition hover:text-cyan-300"
            >
              View all <span className="text-base">→</span>
            </Link>
          </div>

          {/* NFT cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featuredNFTs.map((nft) => {
              const isFavorite = favorites.includes(nft.id);

              return (
                <article
                  key={nft.id}
                  className="group min-w-0 overflow-hidden rounded-lg border border-blue-900/70 bg-[#061021] transition duration-300 hover:border-cyan-500/60"
                >
                  {/* Artwork */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0b1830]">
                    <Link
                      href={`/nft/${nft.id}`}
                      aria-label={`View ${nft.name}`}
                      className="absolute inset-0"
                    >
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Favorite button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(nft.id)}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorite}
                      className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-[#020817]/80 backdrop-blur transition ${
                        isFavorite
                          ? "text-pink-400"
                          : "text-white hover:text-pink-400"
                      }`}
                    >
                      <FiHeart
                        className={`text-sm ${isFavorite ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* NFT details */}
                  <div className="p-2.5">
                    <Link
                      href={`/nft/${nft.id}`}
                      className="block truncate text-xs font-semibold text-white hover:text-cyan-300"
                    >
                      {nft.name}
                    </Link>

                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      {nft.collection}
                    </p>

                    {/* Price */}
                    <div className="mt-2 flex items-center justify-between gap-1 border-t border-white/5 pt-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <SiSolana
                          aria-label="Solana"
                          className="shrink-0 text-sm text-cyan-400"
                        />

                        <span className="truncate text-xs font-semibold text-white">
                          {nft.price}
                        </span>
                      </div>

                      <span className="shrink-0 text-[10px] text-blue-300">
                        ≈ {nft.usd}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <LiveActivities />
      </div>
    </section>
  );
}
