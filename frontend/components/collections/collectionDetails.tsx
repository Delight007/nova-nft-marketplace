"use client";

import Image from "next/image";
import { useState } from "react";
import { FaGlobe, FaInstagram, FaXTwitter } from "react-icons/fa6";

import {
  FiCheck,
  FiCopy,
  FiShare2,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { SiDiscord } from "react-icons/si";

import { useCollectionDetails } from "@/hooks/use-collection-details";

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatSol(value: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "— SOL";
  }

  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} SOL`;
}

function formatPercent(value: number | null, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(digits)}%`;
}

export default function CollectionDetails({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const { data: collection, isPending, isError } = useCollectionDetails(slug);

  if (isPending) {
    return (
      <section className="container border-b border-white/10 bg-[#020812] py-12 text-center text-slate-300">
        Loading collection...
      </section>
    );
  }

  if (isError || !collection) {
    return (
      <section className="container border-b border-white/10 bg-[#020812] py-12 text-center text-slate-300">
        Collection not found.
      </section>
    );
  }

  const floorPrice = collection.stats.floorPrice;
  const volume24h = collection.stats.volume24h;
  const volumeChange = collection.stats.volumeChange;
  const banner = collection.banner ?? collection.image ?? "/images/n.png";
  const avatar = collection.creatorAvatar ?? collection.image ?? "/images/n.png";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/collections/${collection.slug}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareCollection = async () => {
    const url = `${window.location.origin}/collections/${collection.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: collection.name,
          text: collection.description ?? "",
          url,
        });
      } catch {
        // Sharing was cancelled or unavailable.
      }
    } else {
      await copyLink();
    }
  };

  return (
    <section className="container relative overflow-hidden border-b border-white/10 bg-[#020812]">
      <div className="absolute inset-0">
        <Image
          src={banner}
          alt={`${collection.name} banner`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Keep the text readable while showing artwork on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020812] via-[#020812]/95 via-35% to-[#020812]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020812]/90 via-transparent to-[#020812]/15" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Collection profile and actions */}
        <div className="flex min-h-[210px] items-start gap-5 pt-7 md:gap-6">
          {/* Square collection avatar */}
          <div className="relative mt-0.5 hidden h-[143px] w-[146px] shrink-0 overflow-hidden rounded-2xl border border-cyan-400/70 bg-[#071120] sm:block">
            <Image
              src={avatar}
              alt={collection.name}
              fill
              sizes="146px"
              className="object-cover"
            />
          </div>

          {/* Collection information */}
          <div className="min-w-0 flex-1">
            {/* Title and action buttons */}
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-white md:text-[25px]">
                    {collection.name}
                  </h1>

                  {collection.verified && (
                    <span
                      aria-label="Verified collection"
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
                    >
                      <FiCheck className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="mt-1.5 flex items-center gap-2 text-xs text-slate-300">
                  <span className="relative h-6 w-6 overflow-hidden rounded-full border border-white/20">
                    <Image
                      src={avatar}
                      alt=""
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    by <span className="text-cyan-300">{collection.creator}</span>
                  </span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 pt-2">
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-xs font-medium text-white transition hover:brightness-110"
                >
                  <FiUsers className="h-3.5 w-3.5" />
                  Follow
                </button>

                <button
                  type="button"
                  onClick={shareCollection}
                  className="flex h-9 items-center gap-2 rounded-full border border-white/30 bg-[#020812]/60 px-5 text-xs text-white backdrop-blur-md transition hover:border-cyan-400"
                >
                  <FiShare2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
            </div>

            {/* Short description */}
            <p className="mt-3 max-w-[470px] text-xs leading-[18px] text-slate-300 md:text-[12px]">
              {collection.description || "No collection description available."}
            </p>

            {/* Website and social links */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {collection.website && (
                <a
                  href={`https://${collection.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[11px] text-emerald-300 transition hover:text-white"
                >
                  <FaGlobe className="h-3.5 w-3.5" />
                  {collection.website}
                </a>
              )}

              <a
                href={collection.twitter || "#"}
                aria-label="X"
                className="text-slate-300 transition hover:text-white"
                target={collection.twitter ? "_blank" : undefined}
                rel={collection.twitter ? "noreferrer" : undefined}
              >
                <FaXTwitter className="h-3.5 w-3.5" />
              </a>

              <a
                href={collection.discord || "#"}
                aria-label="Discord"
                className="text-slate-300 transition hover:text-white"
                target={collection.discord ? "_blank" : undefined}
                rel={collection.discord ? "noreferrer" : undefined}
              >
                <SiDiscord className="h-3.5 w-3.5" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="text-slate-300 transition hover:text-white"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy collection link"
                title={copied ? "Copied!" : "Copy collection link"}
                className="text-slate-300 transition hover:text-cyan-300"
              >
                <FiCopy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact statistics bar */}
        <div className="grid min-h-[73px] grid-cols-2 border-t border-white/10 py-3 md:grid-cols-4 md:py-3">
          <CollectionStat
            label="Floor Price"
            value={formatSol(floorPrice)}
            subValue={floorPrice ? `≈ ${collection.stats.floorCurrency}` : undefined}
            icon="◆"
          />

          <CollectionStat
            label="24h Volume"
            value={formatSol(volume24h)}
            subValue={volumeChange !== null ? `≈ ${formatCompactNumber(volume24h)} SOL` : undefined}
            change={volumeChange === null ? undefined : `${volumeChange.toFixed(1)}%`}
            icon="↗"
          />

          <CollectionStat
            label="Items"
            value={formatCompactNumber(collection.stats.items)}
            icon="▦"
          />

          <CollectionStat
            label="Owners"
            value={formatCompactNumber(collection.stats.owners)}
            subValue={formatPercent(collection.stats.ownerPercentage)}
            icon="♧"
          />
        </div>
      </div>
    </section>
  );
}

/* Collection statistics item */
function CollectionStat({
  label,
  value,
  subValue,
  change,
  icon,
}: {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  icon: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-r border-white/10 px-3 first:pl-0 last:border-r-0 md:px-6">
      <div className="flex h-8 w-6 shrink-0 items-center justify-center text-xl text-sky-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 md:text-[11px]">{label}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold text-white md:text-sm">
            {value}
          </span>

          {change && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <FiTrendingUp className="h-3 w-3" />
              {change}
            </span>
          )}
        </div>

        {subValue && (
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
