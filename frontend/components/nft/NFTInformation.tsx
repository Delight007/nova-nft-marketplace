import { FiCheck, FiCopy } from "react-icons/fi";
import NFTPurchaseCard from "./NFTPurchaseCard";
import { images, nft } from "./nftDetailsData";

type NFTInformationProps = {
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
  return (
    <div className="min-w-0 lg:h-full lg:min-h-0 lg:overflow-y-auto">
      <div className="mb-4 flex items-center gap-3">
        <img
          src={images[1]}
          alt="Neon Realms"
          className="h-12 w-12 rounded-full border border-violet-500/40 object-cover"
        />
        <div className="min-w-0">
          <a
            href="/collections/neon-realms"
            className="flex items-center gap-1.5 text-sm font-semibold hover:text-cyan-300"
          >
            {nft.collection}
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] text-[#03101c]">
              <FiCheck />
            </span>
          </a>
          <p className="mt-1 text-xs text-blue-300">
            10,000 items <span className="px-1">•</span> Floor {nft.floor}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight md:text-[32px]">
        {nft.name}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-blue-300">
        Owned by{" "}
        <button onClick={onCopyAddress} className="hover:text-cyan-300">
          {nft.owner}
        </button>
        <button
          onClick={onCopyAddress}
          aria-label="Copy owner address"
          className="hover:text-cyan-300"
        >
          <FiCopy className={copied ? "text-cyan-300" : ""} />
        </button>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-blue-200">
        {nft.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {["PFP", "Legendary", "1 of 10,000"].map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-[#1b3152] bg-[#07152b] px-3 py-1.5 text-xs text-blue-200"
          >
            {tag}
          </span>
        ))}
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
