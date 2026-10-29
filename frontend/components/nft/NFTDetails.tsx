// "use client";

// import { useState } from "react";
// import { FiArrowLeft, FiBell } from "react-icons/fi";
// import NFTArtworkGallery from "./NFTArtworkGallery";
// import NFTDetailsPanel from "./NFTDetailsPanel";
// import NFTInformation from "./NFTInformation";
// import NFTSidebar from "./NFTSidebar";
// import { nft } from "./nftDetailsData";

// export default function NFTDetails() {
//   const [activeImage, setActiveImage] = useState(0);
//   const [favorite, setFavorite] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [notice, setNotice] = useState("");
//   const [offerOpen, setOfferOpen] = useState(false);
//   const [offerPrice, setOfferPrice] = useState("7.5");

//   const copyAddress = async () => {
//     try {
//       await navigator.clipboard.writeText(nft.owner);
//       setCopied(true);
//       setNotice("Wallet address copied");
//       window.setTimeout(() => setCopied(false), 2000);
//     } catch {
//       setNotice("Unable to copy address");
//     }
//   };

//   const shareNFT = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setNotice("NFT link copied to clipboard");
//     } catch {
//       setNotice("Share this page using your browser's address bar");
//     }
//   };

//   return (
//     <section className="container min-h-screen bg-[#020814] text-white">
//       <div className="mx-auto max-w-7xl px-5 pb-12 pt-5 md:px-8">
//         <a
//           href="/collections"
//           className="mb-4 inline-flex items-center gap-2 text-xs text-blue-300 hover:text-cyan-300"
//         >
//           <FiArrowLeft />
//           Back to Collection
//         </a>

//         {/* MAIN THREE-COLUMN LAYOUT */}
//         <section className="grid grid-cols-1 items-stretch gap-5 lg:h-[600px] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)_minmax(230px,0.7fr)] lg:grid-rows-[minmax(0,1fr)] xl:gap-7">
//           {/* LEFT: ARTWORK GALLERY */}
//           <NFTArtworkGallery
//             activeImage={activeImage}
//             favorite={favorite}
//             onImageChange={setActiveImage}
//             onToggleFavorite={() => setFavorite((current) => !current)}
//             onNotice={setNotice}
//           />

//           {/* CENTER: NFT INFORMATION */}
//           <NFTInformation
//             favorite={favorite}
//             copied={copied}
//             offerOpen={offerOpen}
//             offerPrice={offerPrice}
//             showMore={showMore}
//             onCopyAddress={copyAddress}
//             onFavorite={() => setFavorite((current) => !current)}
//             onOfferOpen={() => setOfferOpen((current) => !current)}
//             onOfferPriceChange={setOfferPrice}
//             onShare={shareNFT}
//             onShowMore={() => setShowMore((current) => !current)}
//             onCloseMore={() => setShowMore(false)}
//             onAction={setNotice}
//           />

//           {/* RIGHT SIDEBAR */}
//           <NFTSidebar onAction={setNotice} onShare={shareNFT} />
//         </section>

//         <NFTDetailsPanel onAction={setNotice} />

//         <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#142541] pt-5 text-xs text-slate-500">
//           <p>© 2026 NOVA Marketplace</p>
//           <div className="flex gap-5">
//             <a href="/terms" className="hover:text-blue-300">
//               Terms
//             </a>
//             <a href="/privacy" className="hover:text-blue-300">
//               Privacy
//             </a>
//           </div>
//         </footer>
//       </div>

//       {notice && (
//         <div
//           role="status"
//           className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-[#29476b] bg-[#0b1930] px-5 py-3 text-sm text-blue-100 shadow-2xl"
//         >
//           <span className="text-cyan-400">
//             <FiBell />
//           </span>
//           <span>{notice}</span>
//           <button
//             onClick={() => setNotice("")}
//             aria-label="Dismiss notification"
//             className="ml-2 text-slate-400 hover:text-white"
//           >
//             ×
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }

"use client";

import { useNFTDetails } from "@/hooks/use-nft-details";
import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import NFTArtworkGallery from "./NFTArtworkGallery";
import NFTDetailsPanel from "./NFTDetailsPanel";
import NFTInformation from "./NFTInformation";
import NFTSidebar from "./NFTSidebar";

type NFTDetailsProps = {
  id: string;
};

export default function NFTDetails({ id }: NFTDetailsProps) {
  const { data: nft, isPending, isError, error } = useNFTDetails(id);

  const [favorite, setFavorite] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerPrice, setOfferPrice] = useState("7.5");

  const copyAddress = async () => {
    if (!nft) return;

    try {
      await navigator.clipboard.writeText(nft.owner.wallet);
      setCopied(true);
      setNotice("Wallet address copied");
    } catch {
      setNotice("Unable to copy address");
    }
  };

  const shareNFT = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("NFT link copied to clipboard");
    } catch {
      setNotice("Share this page using your browser's address bar");
    }
  };

  if (isError || (!isPending && !nft)) {
    return (
      <section className="container flex min-h-screen items-center justify-center bg-[#020814] px-5 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Unable to load NFT</h1>
          <p className="mt-3 text-sm text-blue-300">
            {isError
              ? error instanceof Error
                ? error.message
                : "Something went wrong while fetching this NFT."
              : "This NFT could not be found."}
          </p>
          <Link
            href="/collections"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#29476b] px-4 py-2 text-sm text-blue-200 hover:border-cyan-400"
          >
            <FiArrowLeft />
            Back to Collections
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container min-h-screen bg-[#020814] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-5 md:px-8">
        {nft ? (
          <a
            href={
              nft.collection
                ? `/collections/${nft.collection.slug}`
                : "/collections"
            }
            className="mb-4 inline-flex items-center gap-2 text-xs text-blue-300 hover:text-cyan-300"
          >
            <FiArrowLeft />
            Back to Collection
          </a>
        ) : (
          <div className="mb-4 h-4 w-36 animate-pulse rounded bg-[#152849]" />
        )}

        <section className="grid grid-cols-1 items-stretch gap-5 lg:h-[600px] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)_minmax(230px,0.7fr)] lg:grid-rows-[minmax(0,1fr)] xl:gap-7">
          <NFTArtworkGallery
            nft={nft}
            isLoading={isPending}
            favorite={favorite}
            onToggleFavorite={() => setFavorite((previous) => !previous)}
          />
          <NFTInformation
            nft={nft}
            isLoading={isPending}
            favorite={favorite}
            copied={copied}
            offerOpen={offerOpen}
            offerPrice={offerPrice}
            showMore={showMore}
            onCopyAddress={copyAddress}
            onFavorite={() => setFavorite((previous) => !previous)}
            onOfferOpen={() => setOfferOpen((previous) => !previous)}
            onOfferPriceChange={setOfferPrice}
            onShare={shareNFT}
            onShowMore={() => setShowMore(true)}
            onCloseMore={() => setShowMore(false)}
            onAction={setNotice}
          />
          <NFTSidebar
            nft={nft}
            isLoading={isPending}
            onAction={setNotice}
            onShare={shareNFT}
          />
        </section>

        <NFTDetailsPanel
          nft={nft}
          isLoading={isPending}
          onAction={setNotice}
        />

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#142541] pt-5 text-xs text-slate-500">
          <p>© 2026 NOVA Marketplace</p>
          <div className="flex gap-5">
            <a href="/terms" className="hover:text-blue-300">
              Terms
            </a>
            <a href="/privacy" className="hover:text-blue-300">
              Privacy
            </a>
          </div>
        </footer>
      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-[#29476b] bg-[#0b1930] px-5 py-3 text-sm text-blue-100 shadow-2xl"
        >
          <span className="text-cyan-400">
            <FiBell />
          </span>
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="ml-2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
