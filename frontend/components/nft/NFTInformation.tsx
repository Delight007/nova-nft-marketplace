// import { FiCheck, FiCopy } from "react-icons/fi";
// import NFTPurchaseCard from "./NFTPurchaseCard";
// import { images, nft } from "./nftDetailsData";

// type NFTInformationProps = {
//   favorite: boolean;
//   copied: boolean;
//   offerOpen: boolean;
//   offerPrice: string;
//   showMore: boolean;
//   onCopyAddress: () => void;
//   onFavorite: () => void;
//   onOfferOpen: () => void;
//   onOfferPriceChange: (price: string) => void;
//   onShare: () => void;
//   onShowMore: () => void;
//   onCloseMore: () => void;
//   onAction: (message: string) => void;
// };

// export default function NFTInformation({
//   favorite,
//   copied,
//   offerOpen,
//   offerPrice,
//   showMore,
//   onCopyAddress,
//   onFavorite,
//   onOfferOpen,
//   onOfferPriceChange,
//   onShare,
//   onShowMore,
//   onCloseMore,
//   onAction,
// }: NFTInformationProps) {
//   return (
//     <div className="min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto">
//       <div className="mb-4 flex items-center gap-3">
//         <img
//           src={images[1]}
//           alt="Neon Realms"
//           className="h-12 w-12 rounded-full border border-violet-500/40 object-cover"
//         />
//         <div className="min-w-0">
//           <a
//             href="/collections/neon-realms"
//             className="flex items-center gap-1.5 text-sm font-semibold hover:text-cyan-300"
//           >
//             {nft.collection}
//             <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] text-[#03101c]">
//               <FiCheck />
//             </span>
//           </a>
//           <p className="mt-1 text-xs text-blue-300">
//             10,000 items <span className="px-1">•</span> Floor {nft.floor}
//           </p>
//         </div>
//       </div>

//       <h1 className="text-3xl font-semibold tracking-tight md:text-[32px]">
//         {nft.name}
//       </h1>
//       <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-blue-300">
//         Owned by{" "}
//         <button onClick={onCopyAddress} className="hover:text-cyan-300">
//           {nft.owner}
//         </button>
//         <button
//           onClick={onCopyAddress}
//           aria-label="Copy owner address"
//           className="hover:text-cyan-300"
//         >
//           <FiCopy className={copied ? "text-cyan-300" : ""} />
//         </button>
//       </div>
//       <p className="mt-4 text-[13px] leading-6 text-blue-200">
//         {nft.description}
//       </p>
//       <div className="mt-3 flex flex-wrap gap-2">
//         {["PFP", "Legendary", "1 of 10,000"].map((tag) => (
//           <span
//             key={tag}
//             className="rounded-lg border border-[#1b3152] bg-[#07152b] px-3 py-1.5 text-xs text-blue-200"
//           >
//             {tag}
//           </span>
//         ))}
//       </div>

//       <NFTPurchaseCard
//         favorite={favorite}
//         offerOpen={offerOpen}
//         offerPrice={offerPrice}
//         showMore={showMore}
//         onFavorite={onFavorite}
//         onOfferOpen={onOfferOpen}
//         onOfferPriceChange={onOfferPriceChange}
//         onShare={onShare}
//         onShowMore={onShowMore}
//         onCloseMore={onCloseMore}
//         onAction={onAction}
//       />
//     </div>
//   );
// }

"use client";

import type { NFTDetailsData } from "@/services/nfts";
import { FiCheck, FiCopy } from "react-icons/fi";
import NFTPurchaseCard from "./NFTPurchaseCard";

type NFTInformationProps = {
  nft?: NFTDetailsData;
  isLoading?: boolean;
  favorite: boolean;
  copied: boolean;
  offerOpen: boolean;
  offerPrice: string;
  showMore: boolean;
  onCopyAddress: () => void;
  onFavorite: () => void;
  onOfferOpen: () => void;
  onOfferPriceChange: (price: string) => void;
  onShare: () => void;
  onShowMore: () => void;
  onCloseMore: () => void;
  onAction: (message: string) => void;
};

export default function NFTInformation({
  nft,
  isLoading = false,
  favorite,
  copied,
  offerOpen,
  offerPrice,
  showMore,
  onCopyAddress,
  onFavorite,
  onOfferOpen,
  onOfferPriceChange,
  onShare,
  onShowMore,
  onCloseMore,
  onAction,
}: NFTInformationProps) {
  if (isLoading || !nft) {
    return (
      <div
        aria-label="Loading NFT details"
        className="min-w-0 animate-pulse space-y-4 lg:h-full lg:min-h-0 lg:overflow-y-auto"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#0a1730]" />
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-[#152849]" />
            <div className="h-3 w-24 rounded bg-[#152849]" />
          </div>
        </div>
        <div className="h-8 w-3/4 rounded bg-[#152849]" />
        <div className="h-3 w-1/2 rounded bg-[#152849]" />
        <div className="h-20 rounded-xl bg-[#07152b]" />
        <div className="h-44 rounded-2xl bg-[#071124]" />
      </div>
    );
  }

  const collection = nft.collection;
  const ownerWallet = nft.owner.wallet;
  const shortOwner = `${ownerWallet.slice(0, 6)}...${ownerWallet.slice(-4)}`;

  const activeListing = nft.listing;

  return (
    <div className="min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto">
      <div className="mb-4 flex items-center gap-3">
        {collection?.image ? (
          <img
            src={collection.image}
            alt={collection.name}
            className="h-12 w-12 rounded-full border border-violet-500/40 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/40 bg-[#0a1730] text-lg font-semibold text-violet-300">
            {collection?.name?.charAt(0) ?? "N"}
          </div>
        )}

        <div className="min-w-0">
          {collection ? (
            <a
              href={`/collections/${collection.slug}`}
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-cyan-300"
            >
              {collection.name}

              {collection.verified && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] text-[#03101c]">
                  <FiCheck />
                </span>
              )}
            </a>
          ) : (
            <p className="text-sm font-semibold text-blue-200">
              Unverified collection
            </p>
          )}

          <p className="mt-1 text-xs text-blue-300">
            {activeListing
              ? `Listed for ${activeListing.price} ${activeListing.currency}`
              : "Not currently listed"}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight md:text-[32px]">
        {nft.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-blue-300">
        Owned by{" "}
        <button onClick={onCopyAddress} className="hover:text-cyan-300">
          {shortOwner}
        </button>
        <button
          onClick={onCopyAddress}
          aria-label="Copy owner address"
          className="hover:text-cyan-300"
        >
          <FiCopy className={copied ? "text-cyan-300" : ""} />
        </button>
      </div>

      {nft.description && (
        <p className="mt-4 text-[13px] leading-6 text-blue-200">
          {nft.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {Array.isArray(nft.attributes) &&
          nft.attributes.map((attribute, index) => {
            if (
              typeof attribute !== "object" ||
              attribute === null ||
              !("trait_type" in attribute) ||
              !("value" in attribute)
            ) {
              return null;
            }

            const trait = attribute as {
              trait_type: string;
              value: string | number;
            };

            return (
              <span
                key={`${trait.trait_type}-${index}`}
                className="rounded-lg border border-[#1b3152] bg-[#07152b] px-3 py-1.5 text-xs text-blue-200"
              >
                {trait.trait_type}: {trait.value}
              </span>
            );
          })}
      </div>

      <NFTPurchaseCard
        favorite={favorite}
        offerOpen={offerOpen}
        offerPrice={offerPrice}
        showMore={showMore}
        onFavorite={onFavorite}
        onOfferOpen={onOfferOpen}
        onOfferPriceChange={onOfferPriceChange}
        onShare={onShare}
        onShowMore={onShowMore}
        onCloseMore={onCloseMore}
        onAction={onAction}
      />
    </div>
  );
}
