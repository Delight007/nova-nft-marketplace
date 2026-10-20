"use client";

import Image from "next/image";
import { useState } from "react";

import { FaCheck, FaHeart } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

interface Nft {
  id: string;
  name: string;
  collection: string;
  price: string;
  image: string;
  rarity?: string;
}

interface ProfileNftCardProps {
  nft: Nft;
}

export default function ProfileNftCard({ nft }: ProfileNftCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-blue-500/15 bg-[#031126] transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
      {/* IMAGE */}
      <div className="relative aspect-[1.25/1] overflow-hidden">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* RARITY */}
        {nft.rarity && (
          <span className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
            ✦ {nft.rarity}
          </span>
        )}

        {/* HEART */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
        >
          <FaHeart className={liked ? "text-pink-500" : "text-white"} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* COLLECTION */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400" />

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate text-xs text-slate-300">
                {nft.collection}
              </p>

              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[7px] text-black">
                <FaCheck />
              </span>
            </div>

            <p className="truncate text-[11px] text-white">{nft.name}</p>
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <SiSolana
              aria-hidden="true"
              className="h-5 w-5 text-[#14F195]"
            />

            <span className="text-sm font-semibold text-white">
              {nft.price}
            </span>
          </div>

          <span className="text-[10px] text-blue-400">{nft.id}</span>
        </div>
      </div>
    </article>
  );
}
