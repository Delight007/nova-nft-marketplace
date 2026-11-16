"use client";

import Link from "next/link";
import { useState } from "react";
import { useFeaturedNFTs } from "@/hooks/use-marketPlace";
import { FiArrowLeft, FiArrowRight, FiHeart, FiTrendingUp } from "react-icons/fi";

export default function FeaturedNFTSlider() {
  const { data, isPending, isError, error } = useFeaturedNFTs();
  const nfts = data?.nfts ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const safeIndex = Math.min(activeIndex, Math.max(0, nfts.length - 1));
  const nft = nfts[safeIndex];
  const isFavorite = nft ? favorites.includes(nft.id) : false;
  const nftHref = nft
    ? `/nft/${encodeURIComponent(nft.mintAddress ?? nft.id)}`
    : "";
  const price = nft?.listing
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(
        nft.listing.price,
      )
    : null;

  const toggleFavorite = () => {
    if (!nft) return;
    setFavorites((current) =>
      isFavorite
        ? current.filter((id) => id !== nft.id)
        : [...current, nft.id],
    );
  };

  return (
    <section className="relative mx-auto w-full max-w-[500px] min-w-0 lg:ml-auto">
      <div className="pointer-events-none absolute -inset-10 rounded-[50px] bg-blue-700/30 blur-[70px]" />
      <div className="pointer-events-none absolute -right-8 top-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18)_0%,rgba(37,99,235,0.07)_45%,transparent_72%)] blur-2xl"
      />

      <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#071020] p-2 shadow-2xl shadow-blue-950/30">
        {isPending ? (
          <div
            aria-label="Loading featured NFT"
            className="aspect-[5/4] animate-pulse rounded-xl bg-[#10172b]"
          />
        ) : isError ? (
          <div role="alert" className="rounded-xl bg-[#10172b] p-8 text-sm text-red-200">
            Unable to load a featured NFT
            {error instanceof Error ? `: ${error.message}` : "."}
          </div>
        ) : !nft ? (
          <div className="rounded-xl bg-[#10172b] p-8 text-center text-sm text-slate-400">
            No NFTs are available yet.
          </div>
        ) : (
          <>
            <div className="group relative aspect-[5/4] overflow-hidden rounded-xl bg-[#10172b]">
              <Link
                href={nftHref}
                aria-label={`View ${nft.name}`}
                className="absolute inset-0"
              >
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name}
                    fetchPriority={activeIndex === 0 ? "high" : "auto"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm text-slate-500">
                    No image available
                  </span>
                )}
              </Link>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-black/20" />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-300/30 bg-black/50 px-3 py-2 text-[10px] font-bold tracking-widest text-cyan-300 backdrop-blur-md">
                <FiTrendingUp className="text-sm" />
                {nft.listing ? "RECENTLY LISTED" : "RECENTLY ADDED"}
              </div>

              <button
                type="button"
                onClick={toggleFavorite}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={isFavorite}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:border-pink-400 hover:text-pink-400"
              >
                <FiHeart
                  className={isFavorite ? "fill-pink-500 text-pink-500" : ""}
                />
              </button>

              <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {nft.name}
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Collection: {nft.collection?.name ?? "Uncategorized"}
                </p>
              </div>

              {nfts.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        (current - 1 + nfts.length) % nfts.length,
                      )
                    }
                    aria-label="Previous NFT"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
                  >
                    <FiArrowLeft />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) => (current + 1) % nfts.length)
                    }
                    aria-label="Next NFT"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
                  >
                    <FiArrowRight />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-3 py-4 sm:px-4">
              <div>
                <p className="text-xs text-slate-500">
                  {nft.listing ? "Current price" : "Status"}
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {price !== null
                    ? `${price} ${nft.listing?.currency ?? "SOL"}`
                    : "Not listed"}
                </p>
              </div>

              <Link
                href={nftHref}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:px-5"
              >
                {nft.listing ? "Buy NFT" : "View NFT"}
                <FiArrowRight />
              </Link>
            </div>
          </>
        )}
      </div>

      {nft && nfts.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 px-1">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-white">
              {String(safeIndex + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(nfts.length).padStart(2, "0")}
          </p>

          <div className="flex items-center gap-2">
            {nfts.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${item.name}`}
                aria-pressed={index === safeIndex}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === safeIndex
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
