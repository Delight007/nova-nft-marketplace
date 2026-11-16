import type { MarketplaceNFT } from "@/services/marketplace";
import NFTCard from "./nftCard";
import type { MarketplaceView } from "./MarketplaceFilters";

type NFTGridProps = {
  nfts: MarketplaceNFT[];
  view: MarketplaceView;
};

export default function NFTGrid({ nfts, view }: NFTGridProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          : "grid grid-cols-1 gap-4"
      }
    >
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} view={view} />
      ))}
    </div>
  );
}
