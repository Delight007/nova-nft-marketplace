"use client";

import Image from "next/image";
import Link from "next/link";
import { useFeaturedCollections } from "@/hooks/use-marketPlace";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

export default function ExploreHero() {
  const { data: featuredCollections = [] } = useFeaturedCollections();
  const featuredCollection = featuredCollections[0];

  return (
    <section className="container relative isolate overflow-hidden border-b border-white/5 py-5 lg:py-8">
      {/* Background image and contrast overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/b.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030917]/80 via-[#030917]/55 to-[#030917]/25" />
        <div className="absolute inset-0 bg-[#030917]/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[170px] max-w-7xl items-center justify-between gap-10 px-6 lg:px-10">
        {/* Left */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-purple-300">
              Solana NFT Marketplace
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Explore{" "}
            <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              NFTs
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover, collect and trade the most exciting NFTs on Solana.
            Explore unique digital art, creator collections and rare assets.
          </p>
        </div>

        {featuredCollection && (
          <div className="hidden w-full max-w-[380px] lg:block">
            <Link
              href={`/collections/${encodeURIComponent(featuredCollection.slug)}`}
              className="group relative flex overflow-hidden rounded-2xl border border-white/10 bg-[#080d1c]/80 p-4 backdrop-blur-xl"
            >
              {/* Glow */}
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-600/20 blur-3xl" />

              <div className="relative flex items-center gap-4">
                {/* Collection image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/30 to-cyan-500/20">
                  {featuredCollection.banner && (
                    <img
                      src={featuredCollection.banner}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <FiTrendingUp className="text-sm text-pink-400" />

                    <span className="text-xs text-slate-400">
                      Featured Collection
                    </span>
                  </div>

                  <h3 className="truncate text-base font-semibold text-white">
                    {featuredCollection.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {featuredCollection.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition group-hover:border-purple-500/30 group-hover:bg-purple-500/10 group-hover:text-white">
                  <FiArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
