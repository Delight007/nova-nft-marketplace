import { FiTrendingUp } from "react-icons/fi";

const stats = [
  {
    id: 1,
    value: "124.8K",
    label: "Total Volume (SOL)",
    growth: "+12.5%",
  },
  {
    id: 2,
    value: "18.6K",
    label: "Total Collections",
    growth: "+8.3%",
  },
  {
    id: 3,
    value: "523.4K",
    label: "Total NFTs",
    growth: "+15.7%",
  },
  {
    id: 4,
    value: "92.7K",
    label: "Active Users",
    growth: "+11.2%",
  },
];

export default function MarketplaceStats() {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-xl border border-blue-950 bg-[#050e1d] px-3 pb-4 pt-3">
      {/* Heading */}
      <h2 className="relative z-10 mb-4 text-sm font-bold text-white">
        Marketplace Stats
      </h2>

      {/* Statistics */}
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

            <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <FiTrendingUp />
              {stat.growth}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative neon wave */}
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
