"use client";

import { FaArrowUp, FaChevronDown } from "react-icons/fa";

const stats = [
  {
    label: "Volume",
    value: "186.4 SOL",
    growth: "42.5%",
  },
  {
    label: "Sales",
    value: "42",
    growth: "31.2%",
  },
  {
    label: "Unique Buyers",
    value: "28",
    growth: "26.7%",
  },
];

const chartPoints = [
  5, 8, 6, 10, 7, 12, 9, 11, 8, 14, 17, 13, 18, 15, 20, 17, 22, 18, 24, 21, 28,
  22, 31, 20,
];

export default function CreatorAnalytics() {
  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126] p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Creator Analytics</h3>

        <button className="flex items-center gap-2 rounded-full bg-[#0a1934] px-3 py-2 text-[10px] text-slate-300">
          Last 30 days
          <FaChevronDown className="text-[8px]" />
        </button>
      </div>

      {/* STATS */}
      <div className="mt-6 grid grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`${index !== 0 ? "border-l border-white/10 pl-4" : ""}`}
          >
            <p className="text-[11px] text-slate-400">{stat.label}</p>

            <p className="mt-2 text-base font-semibold text-white">
              {stat.value}
            </p>

            <p className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400">
              <FaArrowUp />
              {stat.growth}
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="relative mt-7 h-[145px]">
        {/* GRID */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[30, 20, 10, 0].map((value) => (
            <div key={value} className="flex items-center gap-2">
              <span className="w-5 text-[9px] text-slate-600">{value}</span>

              <div className="h-px flex-1 bg-white/5" />
            </div>
          ))}
        </div>

        {/* GRAPH */}
        <svg
          viewBox="0 0 500 130"
          preserveAspectRatio="none"
          className="absolute bottom-5 left-7 right-0 h-[115px] w-[calc(100%-28px)]"
        >
          <defs>
            <linearGradient id="analyticsGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />

              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 105 L20 94 L40 100 L60 85 L80 94 L100 78 L120 86 L140 75 L160 81 L180 65 L200 53 L220 70 L240 48 L260 60 L280 44 L300 65 L320 45 L340 52 L360 35 L380 50 L400 20 L420 39 L440 10 L460 32 L480 8 L500 24 L500 130 L0 130 Z"
            fill="url(#analyticsGradient)"
          />

          <path
            d="M0 105 L20 94 L40 100 L60 85 L80 94 L100 78 L120 86 L140 75 L160 81 L180 65 L200 53 L220 70 L240 48 L260 60 L280 44 L300 65 L320 45 L340 52 L360 35 L380 50 L400 20 L420 39 L440 10 L460 32 L480 8 L500 24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
        </svg>

        {/* DATES */}
        <div className="absolute bottom-0 left-7 right-0 flex justify-between">
          <span className="text-[9px] text-slate-600">Apr 10</span>

          <span className="text-[9px] text-slate-600">Apr 17</span>

          <span className="text-[9px] text-slate-600">Apr 24</span>

          <span className="text-[9px] text-slate-600">May 1</span>

          <span className="text-[9px] text-slate-600">May 8</span>
        </div>
      </div>
    </section>
  );
}
