"use client";

import MarketplaceStats from "@/components/marketplaceStats";
import { useCollections } from "@/hooks/use-Collections";
import type { Collection } from "@/services/collections";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getTrendingCollections(collections: Collection[]) {
  return [...collections].sort((a, b) => b.volume - a.volume).slice(0, 4);
}

export default function TrendingCollections() {
  const { data: collections = [], isPending, isError } = useCollections();
  const trendingCollections = getTrendingCollections(collections);

  return (
    <section className="border-b border-white/10 ">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 px-6 py-5 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:px-10">
        <div className="min-w-0 rounded-xl bg-[#050e1d] p-3">
          {/* Section heading */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Trending Collections
              </h2>

              <p className="text-xs text-slate-400">
                Explore the most popular collections on the marketplace.
              </p>
            </div>

            <Link
              href="/collections"
              className="flex shrink-0 items-center gap-2 text-xs text-blue-400 transition hover:text-cyan-300"
            >
              View all <FiArrowRight />
            </Link>
          </div>

          {/* Collection cards */}
          {isPending ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[68px] animate-pulse rounded-lg border border-blue-900/70 bg-[#061021]"
                />
              ))}
            </div>
          ) : isError ? (
            <p className="rounded-lg border border-red-500/20 bg-[#061021] p-4 text-center text-xs text-slate-400">
              Trending collections are unavailable right now.
            </p>
          ) : trendingCollections.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {trendingCollections.map((collection) => (
                <TrendingCollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-blue-900/70 bg-[#061021] p-4 text-center text-xs text-slate-400">
              No collections have been created yet.
            </p>
          )}
        </div>

        <MarketplaceStats />
      </div>
    </section>
  );
}

function TrendingCollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${encodeURIComponent(collection.slug)}`}
      className="group flex min-w-0 items-center gap-2 rounded-lg border border-blue-900/70 bg-[#061021] p-2 transition duration-300 hover:border-cyan-500/60 hover:bg-[#09172b]"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
        <Image
          src={collection.banner || "/images/n.png"}
          alt={collection.name}
          fill
          sizes="40px"
          className="object-cover transition duration-300 group-hover:scale-110"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xs font-semibold text-white transition group-hover:text-cyan-300">
          {collection.name}
        </h3>

        <p className="mt-1 text-[10px] text-slate-400">
          {formatCompactNumber(collection.items)} items
        </p>

        <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-400">
          <FiTrendingUp className="text-[11px]" />
          {formatCompactNumber(collection.volume)} SOL volume
        </p>
      </div>

      <div className="shrink-0 self-end pb-0.5 text-right">
        <p className="text-[10px] font-medium text-cyan-300">
          {collection.floorPrice > 0 ? `${collection.floorPrice} SOL` : "— SOL"}
        </p>
      </div>
    </Link>
  );
}
