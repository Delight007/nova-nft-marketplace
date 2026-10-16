"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiTrendingUp,
} from "react-icons/fi";

const nfts = [
  {
    id: 1,
    name: "Cosmic Explorer #024",
    collection: "Cosmic Explorers",
    price: "2.4 SOL",
    tag: "TRENDING",
    image: "/images/n.png",
  },
  {
    id: 2,
    name: "Neon Genesis #108",
    collection: "Neon Genesis",
    price: "1.8 SOL",
    tag: "HOT NFT",
    image: "/images/n2.png",
  },
  {
    id: 3,
    name: "Cyber Ape #056",
    collection: "Cyber Apes",
    price: "3.1 SOL",
    tag: "TOP PICK",
    image: "/images/n3.jpg",
  },
  {
    id: 4,
    name: "Dreamscape #012",
    collection: "Dreamscapes",
    price: "1.2 SOL",
    tag: "FEATURED",
    image: "/images/n.png",
  },
];

export default function FeaturedNFTSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const nft = nfts[activeIndex];
  const isFavorite = favorites.includes(nft.id);

  const nextNFT = () => {
    setActiveIndex((current) => (current + 1) % nfts.length);
  };

  const previousNFT = () => {
    setActiveIndex((current) => (current - 1 + nfts.length) % nfts.length);
  };

  const toggleFavorite = () => {
    setFavorites((current) =>
      isFavorite ? current.filter((id) => id !== nft.id) : [...current, nft.id],
    );
  };

  return (
    <section className="relative mx-auto w-full max-w-[500px] min-w-0 lg:ml-auto">
      {/* Background glow */}
      {/* blue and blue background glow */}
      <div className="pointer-events-none absolute -inset-10 rounded-[50px] bg-blue-700/30 blur-[70px]" />

      <div className="pointer-events-none absolute -right-8 top-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18)_0%,rgba(37,99,235,0.07)_45%,transparent_72%)] blur-2xl"
      />

      {/* Featured NFT card */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#071020] p-2 shadow-2xl shadow-blue-950/30">
        {/* NFT artwork */}
        <div className="group relative aspect-[5/4] overflow-hidden rounded-xl bg-[#10172b]">
          <Image
            key={nft.id}
            src={nft.image}
            alt={nft.name}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 90vw, 500px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-black/20" />

          {/* Top badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-300/30 bg-black/50 px-3 py-2 text-[10px] font-bold tracking-widest text-cyan-300 backdrop-blur-md">
            <FiTrendingUp className="text-sm" />
            {nft.tag}
          </div>

          {/* Favorite button */}
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

          {/* NFT name on artwork */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {nft.name}
            </h2>

            <p className="mt-1 text-xs text-slate-300">
              Collection: {nft.collection}
            </p>
          </div>

          {/* Navigation arrows */}
          <button
            type="button"
            onClick={previousNFT}
            aria-label="Previous NFT"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
          >
            <FiArrowLeft />
          </button>

          <button
            type="button"
            onClick={nextNFT}
            aria-label="Next NFT"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-400/20"
          >
            <FiArrowRight />
          </button>
        </div>

        {/* NFT information */}
        <div className="flex items-center justify-between gap-3 px-3 py-4 sm:px-4">
          <div>
            <p className="text-xs text-slate-500">Current price</p>

            <p className="mt-1 text-xl font-bold text-white">{nft.price}</p>
          </div>

          <Link
            href={`/nft/${nft.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:px-5"
          >
            Explore NFT
            <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Slider indicators */}
      <div className="mt-4 flex items-center justify-center gap-2 px-1">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-white">
            {String(activeIndex + 1).padStart(2, "0")}
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
              aria-pressed={index === activeIndex}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
