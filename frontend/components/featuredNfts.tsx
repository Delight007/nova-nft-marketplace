"use client";

import LiveActivities from "@/components/liveActivities";
import { useSolUsdPrice } from "@/hooks/use-sol-usd-price";
import Link from "next/link";
import { useFeaturedNFTs } from "@/hooks/use-marketPlace";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { SiSolana } from "react-icons/si";

export default function FeaturedNFTs() {
  const { data, isPending, isError, error } = useFeaturedNFTs();
  const { data: solUsdPrice, isError: isSolUsdPriceError } = useSolUsdPrice();
  const [favorites, setFavorites] = useState<string[]>([]);
  const featuredNFTs = data?.nfts ?? [];

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section className="font-sans border-b border-white/10 bg-[#030917]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 px-6 py-5 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:px-10">
        <div className="min-w-0 rounded-xl ">
          {/* Section heading */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Featured NFTs</h2>

              <p className="text-xs text-slate-400">
                Discover recently listed and newly added NFTs in the
                marketplace.
              </p>
            </div>

            <Link
              href="/explore"
              className="flex shrink-0 items-center gap-2 text-xs text-blue-400 transition hover:text-cyan-300"
            >
              View all <span className="text-base">→</span>
            </Link>
          </div>

          {/* NFT cards */}
          {isPending ? (
            <div
              aria-label="Loading featured NFTs"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] animate-pulse rounded-lg border border-blue-900/70 bg-[#061021]"
                />
              ))}
            </div>
          ) : isError ? (
            <p
              role="alert"
              className="rounded-lg bg-red-950/30 p-4 text-sm text-red-200"
            >
              Unable to load featured NFTs
              {error instanceof Error ? `: ${error.message}` : "."}
            </p>
          ) : featuredNFTs.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-[#061021] p-4 text-sm text-slate-400">
              No NFTs are available yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featuredNFTs.map((nft) => {
                const isFavorite = favorites.includes(nft.id);
                const nftHref = `/nft/${encodeURIComponent(nft.mintAddress ?? nft.id)}`;
                const price = nft.listing
                  ? new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 4,
                    }).format(nft.listing.price)
                  : null;
                const usdPrice =
                  nft.listing?.currency.toUpperCase() === "SOL" && solUsdPrice
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(nft.listing.price * solUsdPrice.usd)
                    : null;

                return (
                  <article
                    key={nft.id}
                    className="group min-w-0 overflow-hidden rounded-lg border border-blue-900/70 bg-[#061021] transition duration-300 hover:border-cyan-500/60"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0b1830]">
                      <Link
                        href={nftHref}
                        aria-label={`View ${nft.name}`}
                        className="absolute inset-0"
                      >
                        {nft.image ? (
                          <img
                            src={nft.image}
                            alt={nft.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-slate-500">
                            No image
                          </span>
                        )}
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(nft.id)}
                        aria-label={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        aria-pressed={isFavorite}
                        className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-[#020817]/80 backdrop-blur transition ${
                          isFavorite
                            ? "text-pink-400"
                            : "text-white hover:text-pink-400"
                        }`}
                      >
                        <FiHeart
                          className={`text-sm ${isFavorite ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="p-2.5">
                      <Link
                        href={nftHref}
                        className="block truncate text-xs font-semibold text-white hover:text-cyan-300"
                      >
                        {nft.name}
                      </Link>

                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {nft.collection?.name ?? "Uncategorized"}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-1 border-t border-white/5 pt-2">
                        <span className="truncate text-xs font-semibold text-white">
                          {price !== null ? (
                            <>
                              <SiSolana
                                aria-label="Solana"
                                className="mr-1 inline text-sm text-cyan-400"
                              />
                              {price} {nft.listing?.currency ?? "SOL"}
                            </>
                          ) : (
                            "Not listed"
                          )}
                        </span>
                        {nft.listing && (
                          <span
                            className="shrink-0 text-[10px] text-blue-300"
                            title="Approximate USD equivalent"
                          >
                            {usdPrice
                              ? `≈ ${usdPrice}`
                              : isSolUsdPriceError
                                ? "USD unavailable"
                                : "USD …"}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <LiveActivities />
      </div>
    </section>
  );
}
