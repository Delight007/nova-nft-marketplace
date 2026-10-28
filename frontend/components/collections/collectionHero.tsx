// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import { FiCheck, FiLayers, FiUsers } from "react-icons/fi";
// import {
//   featuredCollections,
//   sampleCollectionHeroStats,
// } from "./featuredCollections";

// export default function CollectionHero() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   const activeCollection = featuredCollections[activeIndex];

//   useEffect(() => {
//     if (isPaused) return;

//     const interval = setInterval(() => {
//       setActiveIndex((current) => (current + 1) % featuredCollections.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isPaused]);

//   const goToPrevious = () => {
//     setActiveIndex((current) =>
//       current === 0 ? featuredCollections.length - 1 : current - 1,
//     );
//   };

//   const goToNext = () => {
//     setActiveIndex((current) => (current + 1) % featuredCollections.length);
//   };

//   const goToCollection = () => {
//     window.location.href = `/collections/${activeCollection.id}`;
//   };

//   const stats = sampleCollectionHeroStats;

//   const formatStat = (value: number) =>
//     new Intl.NumberFormat("en-US").format(value);

//   return (
//     <section className="container relative overflow-hidden border-b border-white/10 bg-[#020812]">
//       <div
//         className="mx-auto max-w-7xl px-6 lg:px-10 py-5 lg:py-10"
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//       >
//         <div className="grid min-h-[196px] grid-cols-1 gap-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-[50px]">
//           {/* =========================================================
//               LEFT CONTENT
//           ========================================================== */}
//           <div className="flex flex-col justify-between">
//             {/* Heading */}
//             <div>
//               <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-1.5px] text-white md:text-[32px]">
//                 Discover Amazing
//                 <span className="block bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
//                   Collections
//                 </span>
//               </h1>

//               <p className="mt-2.5 max-w-[390px] text-[13px] leading-[19px] text-slate-300">
//                 Explore the most popular and trending NFT collections from
//                 creators around the world. Find your next favorite collection
//                 and be part of something unique.
//               </p>
//             </div>

//             {/* Platform statistics */}

//             <div className="mt-6 grid grid-cols-3">
//               <HeroStat
//                 icon={<FiLayers />}
//                 value={`${formatStat(stats.totalCollections)}+`}
//                 label="Collections"
//               />

//               <HeroStat
//                 icon={<FiLayers />}
//                 value={`${(stats.totalNFTs / 1_000_000).toFixed(1)}M+`}
//                 label="Total NFTs"
//                 bordered
//               />

//               <HeroStat
//                 icon={<FiUsers />}
//                 value={`${formatStat(stats.totalCreators / 1_000)}K+`}
//                 label="Creators"
//                 bordered
//               />
//             </div>
//           </div>

//           {/* =========================================================
//               FEATURED COLLECTION
//           ========================================================== */}
//           <div
//             className="relative min-h-[196px] overflow-hidden rounded-xl border border-violet-500/40 bg-[#07101f]"
//             key={activeCollection.id}
//           >
//             {/* Collection banners */}
//             {featuredCollections.map((collection, index) => (
//               <div
//                 key={collection.id}
//                 className={`absolute inset-0 transition-opacity duration-700 ${
//                   index === activeIndex
//                     ? "opacity-100"
//                     : "pointer-events-none opacity-0"
//                 }`}
//               >
//                 <Image
//                   src={collection.banner}
//                   alt={`${collection.name} collection`}
//                   fill
//                   priority={index === 0}
//                   sizes="(max-width: 1024px) 100vw, 900px"
//                   className="object-cover object-center"
//                 />
//               </div>
//             ))}

//             {/* Dark overlay */}
//             <div className="absolute inset-0 bg-gradient-to-r from-[#050a18] via-[#050a18]/80 via-[32%] to-transparent" />

//             {/* Bottom subtle overlay */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

//             {/* Content */}
//             <div className="relative z-10 flex h-full min-h-[196px] flex-col justify-between p-5 md:p-6">
//               <div>
//                 {/* Featured badge */}
//                 <div
//                   key={`badge-${activeCollection.id}`}
//                   className="inline-flex animate-[collectionFade_0.45s_ease-out] items-center gap-2 rounded-full border border-violet-400/30 bg-[#17142f]/80 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md"
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
//                   Featured Collection
//                 </div>

//                 {/* Collection title */}
//                 <div
//                   key={`content-${activeCollection.id}`}
//                   className="mt-3 animate-[collectionFade_0.45s_ease-out]"
//                 >
//                   <div className="flex items-center gap-2.5">
//                     <h2 className="text-[28px] font-semibold leading-none tracking-[-1px] text-white md:text-[30px]">
//                       {activeCollection.name}
//                     </h2>

//                     {/* Verified */}
//                     {activeCollection.verified && (
//                       <span
//                         aria-label="Verified collection"
//                         className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
//                       >
//                         <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
//                       </span>
//                     )}
//                   </div>

//                   <p className="mt-2 text-[14px] text-white/90">
//                     {activeCollection.subtitle}
//                   </p>

//                   {/* View button */}
//                   <button
//                     type="button"
//                     onClick={goToCollection}
//                     className="mt-5 inline-flex h-10 items-center gap-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-[12px] font-medium text-white shadow-lg shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
//                   >
//                     View Collection
//                     <FaChevronRight className="h-2.5 w-2.5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Carousel controls */}
//               <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
//                 {/* Indicators */}
//                 <div className="mr-1 hidden items-center gap-1.5 sm:flex">
//                   {featuredCollections.map((collection, index) => (
//                     <button
//                       key={collection.id}
//                       type="button"
//                       onClick={() => setActiveIndex(index)}
//                       aria-label={`Go to ${collection.name}`}
//                       aria-current={index === activeIndex ? "true" : undefined}
//                       className={`h-1 rounded-full transition-all duration-300 ${
//                         index === activeIndex
//                           ? "w-5 bg-cyan-400"
//                           : "w-1.5 bg-white/40 hover:bg-white/80"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 {/* Previous */}
//                 <button
//                   type="button"
//                   onClick={goToPrevious}
//                   aria-label="Previous collection"
//                   className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-black/60"
//                 >
//                   <FaChevronLeft className="h-2.5 w-2.5" />
//                 </button>

//                 {/* Next */}
//                 <button
//                   type="button"
//                   onClick={goToNext}
//                   aria-label="Next collection"
//                   className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-black/60"
//                 >
//                   <FaChevronRight className="h-2.5 w-2.5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes collectionFade {
//           from {
//             opacity: 0;
//             transform: translateY(5px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </section>
//   );
// }

// /* ============================================================
//    HERO STAT
// ============================================================ */

// function HeroStat({
//   icon,
//   value,
//   label,
//   bordered = false,
// }: {
//   icon: React.ReactNode;
//   value: string;
//   label: string;
//   bordered?: boolean;
// }) {
//   return (
//     <div
//       className={`flex items-center gap-3 ${
//         bordered ? "border-l border-white/10 pl-5" : ""
//       }`}
//     >
//       <div className="flex h-7 w-6 shrink-0 items-center justify-center text-[20px] text-violet-500">
//         {icon}
//       </div>

//       <div>
//         <p className="text-[13px] font-medium leading-none text-white">
//           {value}
//         </p>

//         <p className="mt-1 text-[10px] text-slate-400">{label}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  useFeaturedCollections,
  useMarketplaceStats,
} from "@/hooks/use-marketPlace";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiCheck, FiLayers, FiUsers } from "react-icons/fi";

export default function CollectionHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const {
    data: featuredCollections = [],
    isPending: isFeaturedPending,
    isError: isFeaturedError,
  } = useFeaturedCollections();

  const {
    data: stats,
    isPending: isStatsPending,
    isError: isStatsError,
  } = useMarketplaceStats();

  const activeCollection = featuredCollections[activeIndex];

  // Keep the active index valid when the API data changes.
  useEffect(() => {
    if (activeIndex >= featuredCollections.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredCollections.length]);

  // Automatically advance the carousel.
  useEffect(() => {
    if (isPaused || featuredCollections.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredCollections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, featuredCollections.length]);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? featuredCollections.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % featuredCollections.length);
  };

  const goToCollection = () => {
    if (!activeCollection) return;

    window.location.href = `/collections/${activeCollection.slug}`;
  };

  const formatStat = (value: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  const displayStat = (value: number | undefined) => {
    if (isStatsPending) return "—";
    if (isStatsError || value === undefined) return "—";

    return `${formatStat(value)}+`;
  };

  return (
    <section className="container relative overflow-hidden border-b border-white/10 bg-[#020812]">
      <div
        className="mx-auto max-w-7xl px-6 py-5 lg:px-10 lg:py-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid min-h-[196px] grid-cols-1 gap-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-[50px]">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-between">
            {/* Heading */}
            <div>
              <h1 className="text-[30px] font-semibold leading-[1.05] tracking-[-1.5px] text-white md:text-[32px]">
                Discover Amazing
                <span className="block bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                  Collections
                </span>
              </h1>

              <p className="mt-2.5 max-w-[390px] text-[13px] leading-[19px] text-slate-300">
                Explore the most popular and trending NFT collections from
                creators around the world. Find your next favorite collection
                and be part of something unique.
              </p>
            </div>

            {/* Platform statistics */}
            <div className="mt-6 grid grid-cols-3">
              <HeroStat
                icon={<FiLayers />}
                value={displayStat(stats?.totalCollections)}
                label="Collections"
              />

              <HeroStat
                icon={<FiLayers />}
                value={displayStat(stats?.totalNFTs)}
                label="Total NFTs"
                bordered
              />

              <HeroStat
                icon={<FiUsers />}
                value={displayStat(stats?.totalCreators)}
                label="Creators"
                bordered
              />
            </div>
          </div>

          {/* FEATURED COLLECTION */}
          <div
            className="relative min-h-[196px] overflow-hidden rounded-xl border border-violet-500/40 bg-[#07101f]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {isFeaturedPending ? (
              <div className="flex min-h-[196px] items-center justify-center text-sm text-slate-400">
                Loading featured collections...
              </div>
            ) : isFeaturedError ? (
              <div className="flex min-h-[196px] flex-col items-center justify-center gap-2 px-5 text-center">
                <p className="text-sm font-medium text-white">
                  Unable to load featured collections
                </p>
                <p className="text-xs text-slate-400">
                  Please try again in a moment.
                </p>
              </div>
            ) : featuredCollections.length === 0 ? (
              <div className="flex min-h-[196px] flex-col items-center justify-center gap-2 px-5 text-center">
                <p className="text-sm font-medium text-white">
                  No featured collections yet
                </p>
                <p className="text-xs text-slate-400">
                  Collections will appear here when they become available.
                </p>
              </div>
            ) : (
              <>
                {/* Collection banners */}
                {featuredCollections.map((collection, index) => (
                  <div
                    key={collection.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === activeIndex
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                  >
                    <Image
                      src={collection.banner || "/images/b.png"}
                      alt={`${collection.name} collection`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 900px"
                      className="object-cover object-center"
                    />
                  </div>
                ))}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050a18] via-[#050a18]/80 via-[32%] to-transparent" />

                {/* Bottom subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                {/* Content */}
                {activeCollection && (
                  <div
                    key={activeCollection.id}
                    className="relative z-10 flex min-h-[196px] flex-col justify-between p-5 md:p-6"
                  >
                    <div>
                      {/* Featured badge */}
                      <div className="inline-flex animate-[collectionFade_0.45s_ease-out] items-center gap-2 rounded-full border border-violet-400/30 bg-[#17142f]/80 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        Featured Collection
                      </div>

                      {/* Collection title */}
                      <div className="mt-3 animate-[collectionFade_0.45s_ease-out]">
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-[28px] font-semibold leading-none tracking-[-1px] text-white md:text-[30px]">
                            {activeCollection.name}
                          </h2>

                          {/* Verified badge */}
                          {activeCollection.verified && (
                            <span
                              aria-label="Verified collection"
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
                            >
                              <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[14px] text-white/90">
                          {activeCollection.subtitle}
                        </p>

                        {/* View collection button */}
                        <button
                          type="button"
                          onClick={goToCollection}
                          className="mt-5 inline-flex h-10 items-center gap-3 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-[12px] font-medium text-white shadow-lg shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
                        >
                          View Collection
                          <FaChevronRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>

                    {/* Carousel controls */}
                    <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
                      {/* Indicators */}
                      <div className="mr-1 hidden items-center gap-1.5 sm:flex">
                        {featuredCollections.map((collection, index) => (
                          <button
                            key={collection.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to ${collection.name}`}
                            aria-current={
                              index === activeIndex ? "true" : undefined
                            }
                            className={`h-1 rounded-full transition-all duration-300 ${
                              index === activeIndex
                                ? "w-5 bg-cyan-400"
                                : "w-1.5 bg-white/40 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Previous */}
                      <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="Previous collection"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-black/60"
                      >
                        <FaChevronLeft className="h-2.5 w-2.5" />
                      </button>

                      {/* Next */}
                      <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Next collection"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-black/60"
                      >
                        <FaChevronRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes collectionFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   HERO STAT
============================================================ */

function HeroStat({
  icon,
  value,
  label,
  bordered = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        bordered ? "border-l border-white/10 pl-5" : ""
      }`}
    >
      <div className="flex h-7 w-6 shrink-0 items-center justify-center text-[20px] text-violet-500">
        {icon}
      </div>

      <div>
        <p className="text-[13px] font-medium leading-none text-white">
          {value}
        </p>

        <p className="mt-1 text-[10px] text-slate-400">{label}</p>
      </div>
    </div>
  );
}
