// "use client";

// import Image from "next/image";
// import { useState } from "react";

// import { FaCheck, FaHeart } from "react-icons/fa";
// import { SiSolana } from "react-icons/si";

// interface Nft {
//   id: string;
//   name: string;
//   collection: string;
//   price: string;
//   image: string;
//   rarity?: string;
// }

// interface ProfileNftCardProps {
//   nft: Nft;
// }

// export default function ProfileNftCard({ nft }: ProfileNftCardProps) {
//   const [liked, setLiked] = useState(false);

//   return (
//     <article className="group overflow-hidden rounded-2xl border border-blue-500/15 bg-[#031126] transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
//       {/* IMAGE */}
//       <div className="relative aspect-[1.25/1] overflow-hidden">
//         <Image
//           src={nft.image}
//           alt={nft.name}
//           fill
//           sizes="(max-width: 768px) 100vw, 300px"
//           className="object-cover transition duration-500 group-hover:scale-105"
//         />

//         {/* RARITY */}
//         {nft.rarity && (
//           <span className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
//             ✦ {nft.rarity}
//           </span>
//         )}

//         {/* HEART */}
//         <button
//           onClick={() => setLiked(!liked)}
//           className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
//         >
//           <FaHeart className={liked ? "text-pink-500" : "text-white"} />
//         </button>
//       </div>

//       {/* CONTENT */}
//       <div className="p-4">
//         {/* COLLECTION */}
//         <div className="flex items-center gap-2">
//           <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400" />

//           <div className="min-w-0">
//             <div className="flex items-center gap-1">
//               <p className="truncate text-xs text-slate-300">
//                 {nft.collection}
//               </p>

//               <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[7px] text-black">
//                 <FaCheck />
//               </span>
//             </div>

//             <p className="truncate text-[11px] text-white">{nft.name}</p>
//           </div>
//         </div>

//         {/* PRICE */}
//         <div className="mt-4 flex items-end justify-between">
//           <div className="flex items-center gap-2">
//             <SiSolana
//               aria-hidden="true"
//               className="h-5 w-5 text-[#14F195]"
//             />

//             <span className="text-sm font-semibold text-white">
//               {nft.price}
//             </span>
//           </div>

//           <span className="text-[10px] text-blue-400">{nft.id}</span>
//         </div>
//       </div>
//     </article>
//   );
// }

"use client";

import type { CollectedNFT } from "@/services/user";
import Link from "next/link";
import { useState } from "react";
import { FaCheck, FaHeart } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

interface ProfileNftCardProps {
  nft: CollectedNFT;
  view?: "grid" | "list";
}

export default function ProfileNftCard({
  nft,
  view = "grid",
}: ProfileNftCardProps) {
  const [liked, setLiked] = useState(false);

  const collectionName = nft.collection?.name ?? "Uncategorized";
  const listing = nft.listing;

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-blue-500/15 bg-[#031126] transition duration-300 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] ${
        view === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <Link
        href={`/nft/${encodeURIComponent(nft.mintAddress)}`}
        className={`relative block overflow-hidden ${
          view === "list"
            ? "aspect-square w-full shrink-0 sm:w-48"
            : "aspect-[1.25/1] w-full"
        }`}
      >
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {nft.collection?.verified && (
          <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-black shadow-lg">
            <FaCheck />
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-400">{collectionName}</p>

            <Link
              href={`/nft/${encodeURIComponent(nft.mintAddress)}`}
              className="mt-1 block truncate text-sm font-semibold text-white transition hover:text-purple-300"
            >
              {nft.name}
            </Link>
          </div>

          <button
            type="button"
            aria-label={liked ? "Unlike NFT" : "Like NFT"}
            aria-pressed={liked}
            onClick={() => setLiked((previous) => !previous)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
          >
            <FaHeart className={liked ? "text-pink-500" : "text-slate-400"} />
          </button>
        </div>

        {nft.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {nft.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] text-slate-500">
              {listing ? "Listed for" : "Current status"}
            </p>

            {listing ? (
              <div className="flex items-center gap-2">
                {listing.currency.toUpperCase() === "SOL" && (
                  <SiSolana
                    aria-hidden="true"
                    className="h-4 w-4 text-[#14F195]"
                  />
                )}

                <span className="text-sm font-semibold text-white">
                  {listing.price} {listing.currency}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-slate-400">
                Not listed
              </span>
            )}
          </div>

          <span
            className="max-w-[140px] truncate text-[10px] text-blue-400"
            title={nft.mintAddress}
          >
            {nft.mintAddress.slice(0, 4)}...
            {nft.mintAddress.slice(-4)}
          </span>
        </div>
      </div>
    </article>
  );
}
