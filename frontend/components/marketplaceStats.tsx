"use client";

import { useMarketplaceStats } from "@/hooks/use-marketPlace";
import { FiMinus, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

function formatStat(value: number) {
  const formatter =
    value >= 1_000
      ? new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        })
      : new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 });

  return formatter.format(value);
}

function formatGrowth(value: number | null | undefined) {
  if (value === undefined) return "Unavailable";
  if (value === null) return "New";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export default function MarketplaceStats() {
  const { data, isPending, isError, error, refetch } = useMarketplaceStats();
  const stats = data
    ? [
        {
          id: "volume",
          value: formatStat(data.totalVolume),
          label: "Total Volume (SOL)",
          growth: data.growth?.totalVolume,
        },
        {
          id: "collections",
          value: formatStat(data.totalCollections),
          label: "Total Collections",
          growth: data.growth?.totalCollections,
        },
        {
          id: "nfts",
          value: formatStat(data.totalNFTs),
          label: "Total NFTs",
          growth: data.growth?.totalNFTs,
        },
        {
          id: "creators",
          value: formatStat(data.totalCreators),
          label: "Marketplace Creators",
          growth: data.growth?.totalCreators,
        },
      ]
    : [];

  return (
    <section className="relative min-w-0 overflow-hidden rounded-xl border border-blue-950 bg-[#050e1d] px-3 pb-4 pt-3">
      <div className="relative z-10 mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-white">Marketplace Stats</h2>
        <span className="text-[9px] text-slate-500">30-day change</span>
      </div>

      {isPending ? (
        <div
          aria-label="Loading marketplace statistics"
          className="relative z-10 grid grid-cols-2 gap-3"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-[68px] animate-pulse rounded bg-white/5"
            />
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="relative z-10 rounded bg-red-950/30 p-3 text-xs text-red-200"
        >
          <p>
            Unable to load marketplace statistics
            {error instanceof Error ? `: ${error.message}` : "."}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 font-medium text-red-100 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-2 gap-y-5">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="min-w-0 border-l border-white/10 px-2 odd:border-l-0"
            >
              <p className="text-base font-semibold tracking-tight text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                {stat.label}
              </p>

              <p
                className={`mt-2 flex items-center gap-1 text-[10px] font-medium ${
                  stat.growth === undefined
                    ? "text-slate-500"
                    : stat.growth === null || stat.growth > 0
                    ? "text-emerald-400"
                    : stat.growth < 0
                      ? "text-rose-400"
                      : "text-slate-400"
                }`}
              >
                {stat.growth === null || stat.growth === undefined ? null : stat.growth > 0 ? (
                  <FiTrendingUp aria-hidden="true" />
                ) : stat.growth < 0 ? (
                  <FiTrendingDown aria-hidden="true" />
                ) : (
                  <FiMinus aria-hidden="true" />
                )}
                {formatGrowth(stat.growth)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 opacity-90">
        <svg
          viewBox="0 0 600 70"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient
              id="waveGradient"
              x1="0"
              y1="0"
              x2="600"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient
              id="waveFill"
              x1="0"
              y1="0"
              x2="0"
              y2="70"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 45 C50 10 75 65 130 35 S210 15 260 42 S340 65 400 30 S500 15 550 40 S585 35 600 20 L600 70 L0 70 Z"
            fill="url(#waveFill)"
          />

          <path
            d="M0 45 C50 10 75 65 130 35 S210 15 260 42 S340 65 400 30 S500 15 550 40 S585 35 600 20"
            stroke="url(#waveGradient)"
            strokeWidth="1.5"
          />

          <path
            d="M0 57 C70 30 100 65 170 48 S260 30 330 53 S430 35 490 48 S560 55 600 38"
            stroke="#7c3aed"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
        </svg>
      </div>
    </section>
  );
}
