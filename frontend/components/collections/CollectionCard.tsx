"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { FiCheck, FiLayers, FiTrendingUp, FiUsers } from "react-icons/fi";

export type Collection = {
  id: number;
  name: string;
  creator: string;
  creatorAvatar: string;
  banner: string;
  items: string;
  floorPrice: string;
  volume: string;
  itemBadge: string;
  verified?: boolean;
};

type CollectionCardProps = {
  collection: Collection;
};

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-blue-500/30 bg-[#030c1b] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/60 hover:shadow-[0_8px_35px_rgba(76,29,149,0.18)]">
      {/* ============================================================
          COLLECTION IMAGE
      ============================================================ */}
      <div className="relative aspect-[1.9/1] overflow-hidden">
        <Image
          src={collection.banner}
          alt={collection.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {/* Item count badge */}
        <div className="absolute right-2.5 top-2.5 rounded-full bg-violet-600/90 px-2 py-1 text-[9px] font-semibold text-white shadow-lg backdrop-blur-sm">
          {collection.itemBadge}
        </div>
      </div>

      {/* ============================================================
          CARD CONTENT
      ============================================================ */}
      <div className="px-3.5 pb-3.5 pt-3">
        {/* Collection name */}
        <div className="flex min-w-0 items-center gap-1.5">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.2px] text-white">
            {collection.name}
          </h3>

          {collection.verified && (
            <span
              aria-label="Verified collection"
              className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
            >
              <FiCheck className="h-2.5 w-2.5 stroke-[3]" />
            </span>
          )}
        </div>

        {/* Creator */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/20">
            <Image
              src={collection.creatorAvatar}
              alt={collection.creator}
              fill
              sizes="20px"
              className="object-cover"
            />
          </div>

          <span className="truncate text-[10px] text-slate-400">
            by <span className="text-blue-200">{collection.creator}</span>
          </span>
        </div>

        {/* ============================================================
            STATS
        ============================================================ */}
        <div className="mt-4 grid grid-cols-3 border-b border-white/10 pb-3">
          {/* Items */}
          <CollectionStat
            icon={<FiLayers />}
            value={collection.items}
            label="Items"
          />

          {/* Floor */}
          <CollectionStat
            icon={<FiUsers />}
            value={collection.floorPrice}
            label="Floor Price"
            bordered
          />

          {/* Volume */}
          <CollectionStat
            icon={<FiTrendingUp />}
            value={collection.volume}
            label="Volume"
            bordered
          />
        </div>

        {/* ============================================================
            VIEW COLLECTION BUTTON
        ============================================================ */}
        <button
          type="button"
          onClick={() => {
            window.location.href = `/collections/${collection.id}`;
          }}
          className="mt-3 flex h-7.5 w-full items-center justify-center gap-2 rounded-lg border border-violet-500/80 bg-gradient-to-r from-violet-600/10 via-violet-500/10 to-cyan-500/10 text-[10px] font-medium text-white transition-all duration-200 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-violet-600 hover:to-cyan-500"
        >
          View Collection
          <FaArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

/* ================================================================
   STAT
================================================================ */

function CollectionStat({
  icon,
  value,
  label,
  bordered = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`min-w-0 ${bordered ? "border-l border-white/10 pl-3" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-[11px] text-blue-300">{icon}</span>

        <span className="truncate text-[11px] font-medium text-white">
          {value}
        </span>
      </div>

      <p className="mt-1 truncate text-[9px] text-slate-400">{label}</p>
    </div>
  );
}
