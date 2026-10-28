// "use client";

// import { FaArrowUp, FaChevronDown } from "react-icons/fa";

// const stats = [
//   {
//     label: "Volume",
//     value: "186.4 SOL",
//     growth: "42.5%",
//   },
//   {
//     label: "Sales",
//     value: "42",
//     growth: "31.2%",
//   },
//   {
//     label: "Unique Buyers",
//     value: "28",
//     growth: "26.7%",
//   },
// ];

// const chartPoints = [
//   5, 8, 6, 10, 7, 12, 9, 11, 8, 14, 17, 13, 18, 15, 20, 17, 22, 18, 24, 21, 28,
//   22, 31, 20,
// ];

// export default function CreatorAnalytics() {
//   return (
//     <section className="rounded-2xl border border-blue-500/20 bg-[#031126] p-5">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-semibold">Creator Analytics</h3>

//         <button className="flex items-center gap-2 rounded-full bg-[#0a1934] px-3 py-2 text-[10px] text-slate-300">
//           Last 30 days
//           <FaChevronDown className="text-[8px]" />
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="mt-6 grid grid-cols-3">
//         {stats.map((stat, index) => (
//           <div
//             key={stat.label}
//             className={`${index !== 0 ? "border-l border-white/10 pl-4" : ""}`}
//           >
//             <p className="text-[11px] text-slate-400">{stat.label}</p>

//             <p className="mt-2 text-base font-semibold text-white">
//               {stat.value}
//             </p>

//             <p className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400">
//               <FaArrowUp />
//               {stat.growth}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* CHART */}
//       <div className="relative mt-7 h-[145px]">
//         {/* GRID */}
//         <div className="absolute inset-0 flex flex-col justify-between">
//           {[30, 20, 10, 0].map((value) => (
//             <div key={value} className="flex items-center gap-2">
//               <span className="w-5 text-[9px] text-slate-600">{value}</span>

//               <div className="h-px flex-1 bg-white/5" />
//             </div>
//           ))}
//         </div>

//         {/* GRAPH */}
//         <svg
//           viewBox="0 0 500 130"
//           preserveAspectRatio="none"
//           className="absolute bottom-5 left-7 right-0 h-[115px] w-[calc(100%-28px)]"
//         >
//           <defs>
//             <linearGradient id="analyticsGradient" x1="0" x2="0" y1="0" y2="1">
//               <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />

//               <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
//             </linearGradient>
//           </defs>

//           <path
//             d="M0 105 L20 94 L40 100 L60 85 L80 94 L100 78 L120 86 L140 75 L160 81 L180 65 L200 53 L220 70 L240 48 L260 60 L280 44 L300 65 L320 45 L340 52 L360 35 L380 50 L400 20 L420 39 L440 10 L460 32 L480 8 L500 24 L500 130 L0 130 Z"
//             fill="url(#analyticsGradient)"
//           />

//           <path
//             d="M0 105 L20 94 L40 100 L60 85 L80 94 L100 78 L120 86 L140 75 L160 81 L180 65 L200 53 L220 70 L240 48 L260 60 L280 44 L300 65 L320 45 L340 52 L360 35 L380 50 L400 20 L420 39 L440 10 L460 32 L480 8 L500 24"
//             fill="none"
//             stroke="#8b5cf6"
//             strokeWidth="2"
//           />
//         </svg>

//         {/* DATES */}
//         <div className="absolute bottom-0 left-7 right-0 flex justify-between">
//           <span className="text-[9px] text-slate-600">Apr 10</span>

//           <span className="text-[9px] text-slate-600">Apr 17</span>

//           <span className="text-[9px] text-slate-600">Apr 24</span>

//           <span className="text-[9px] text-slate-600">May 1</span>

//           <span className="text-[9px] text-slate-600">May 8</span>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useMyCreatorAnalytics } from "@/hooks/use-my-creator-analytics";
import { useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";

function formatVolume(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function CreatorAnalytics() {
  const { data, isLoading, isError, refetch } = useMyCreatorAnalytics();

  const chart = data?.chart ?? [];

  const graph = useMemo(() => {
    const maxVolume = Math.max(...chart.map((point) => point.volume), 0);

    const points = chart.map((point, index) => {
      const x = chart.length > 1 ? (index / (chart.length - 1)) * 500 : 250;

      const y = maxVolume > 0 ? 105 - (point.volume / maxVolume) * 90 : 105;

      return { x, y };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath = points.length > 0 ? `${linePath} L 500 115 L 0 115 Z` : "";

    return { linePath, areaPath };
  }, [chart]);

  const dateLabels =
    chart.length > 0
      ? [
          chart[0],
          chart[Math.floor((chart.length - 1) / 2)],
          chart[chart.length - 1],
        ]
      : [];

  const stats = [
    {
      label: "Volume",
      value: `${formatVolume(data?.volume ?? 0)} SOL`,
    },
    {
      label: "Sales",
      value: String(data?.sales ?? 0),
    },
    {
      label: "Unique Buyers",
      value: String(data?.uniqueBuyers ?? 0),
    },
  ];

  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Creator Analytics</h3>

        <div className="flex items-center gap-2 rounded-full bg-[#0a1934] px-3 py-2 text-[10px] text-slate-300">
          Last 30 days
          <FaChevronDown className="text-[8px]" />
        </div>
      </div>

      {isError ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">Could not load analytics.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm text-cyan-400 hover:text-cyan-300"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index !== 0 ? "border-l border-white/10 pl-3 sm:pl-4" : ""
                }
              >
                <p className="text-[11px] text-slate-400">{stat.label}</p>

                <p className="mt-2 break-words text-sm font-semibold text-white sm:text-base">
                  {isLoading ? "—" : stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-7 h-[165px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/5" />
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="absolute inset-0 animate-pulse rounded-lg bg-white/[0.02]" />
            ) : (
              <svg
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                className="absolute bottom-5 left-0 h-[120px] w-full overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="creatorAnalyticsGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {graph.areaPath && (
                  <path
                    d={graph.areaPath}
                    fill="url(#creatorAnalyticsGradient)"
                  />
                )}

                {graph.linePath && (
                  <path
                    d={graph.linePath}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            )}

            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {dateLabels.map((point, index) => (
                <span
                  key={`${point.date}-${index}`}
                  className="text-[9px] text-slate-500"
                >
                  {formatDate(point.date)}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-slate-500">
            Daily sales volume in SOL · UTC dates
          </p>
        </>
      )}
    </section>
  );
}
