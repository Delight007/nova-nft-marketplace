"use client";
import Link from "next/link";
import { FiArrowRight, FiBox, FiGlobe, FiShield, FiZap } from "react-icons/fi";
import { SiSolana } from "react-icons/si";
import FeaturedNFTSlider from "./featuredNFTSlider";

export default function Hero() {
  return (
    <section className="container font-sans lg:py-15 py-10 relative overflow-hidden border-b border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-36 h-[440px] w-[560px] rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.2)_0%,rgba(37,99,235,0.09)_38%,transparent_72%)] blur-2xl"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid min-h-[420px] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px]">
          {" "}
          {/* Left */}
          <div className="relative flex flex-col justify-center">
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-32 top-1/4 h-[450px] w-[450px] rounded-full bg-blue-700/25 blur-[130px]" />

            <div className="relative">
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <SiSolana className="text-sm" />
                SOLANA NFT MARKETPLACE
              </div>

              {/* Heading */}
              <h1 className="max-w-[650px] text-5xl font-bold leading-[1.05] tracking-tight text-white xl:text-6xl">
                Discover, collect &
                <br />
                trade on{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Solana
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-[570px] text-base leading-7 text-slate-400">
                The next generation NFT marketplace. Buy, sell and discover
                extraordinary digital assets from top creators around the world.
              </p>

              {/* Buttons */}
              <div className="mt-7 flex items-center gap-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Explore Collections
                  <FiArrowRight />
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/10"
                >
                  <FiBox />
                  Create Your NFT
                </Link>
              </div>

              {/* Features */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <Feature icon={<FiZap />} text="Fast & Low Fees" />

                <Feature icon={<FiShield />} text="Secure & Decentralized" />

                <Feature icon={<FiGlobe />} text="Global Community" />

                <Feature icon={<FiBox />} text="True Ownership" />
              </div>
            </div>
          </div>
          {/* Right - Featured Collection */}
          <FeaturedNFTSlider />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span className="text-lg text-cyan-400">{icon}</span>
      {text}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
