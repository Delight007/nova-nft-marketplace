"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

const collections = [
  {
    name: "Neon Realms",
    items: "8.7K items",
    volume: "64.2 SOL",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
  },
  {
    name: "Sky Islands",
    items: "5.4K items",
    volume: "48.9 SOL",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
  },
  {
    name: "Ape Society",
    items: "7.1K items",
    volume: "32.6 SOL",
    image: "https://images.unsplash.com/photo-1634193295627-1cdddf751b4f",
  },
  {
    name: "The Forgotten",
    items: "4.8K items",
    volume: "21.3 SOL",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988",
  },
];

export default function TopCollections() {
  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Top Collections</h3>

        <button className="flex items-center gap-2 text-xs text-purple-400 transition hover:text-cyan-400">
          View all
          <FaArrowRight className="text-[9px]" />
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {collections.map((collection) => (
          <div key={collection.name} className="flex items-center gap-3">
            <Image
              src={collection.image}
              alt={collection.name}
              width={42}
              height={42}
              className="h-[42px] w-[42px] rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {collection.name}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                {collection.items}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-white">
                {collection.volume}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">Volume</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
