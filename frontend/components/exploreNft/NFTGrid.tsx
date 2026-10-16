import NFTCard, { NFT } from "./nftCard";

const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "Cyber Soul #1189",
    collection: "Neon Realms",
    image: "/images/n.png",
    price: 8.3,
    currency: "SOL",
    views: "2.4K",
    listed: "3 hours ago",
    verified: true,
    likes: 124,
  },
  {
    id: "2",
    name: "Spirit Guardian #042",
    collection: "Solana Spirits",
    image: "/images/n2.png",
    price: 5.7,
    currency: "SOL",
    views: "1.8K",
    listed: "1 hour ago",
    verified: true,
    likes: 86,
  },
  {
    id: "3",
    name: "Cyber Ape #8271",
    collection: "Cyber Apes",
    image: "/images/n3.jpg",
    price: 12.5,
    currency: "SOL",
    views: "3.1K",
    listed: "5 hours ago",
    verified: false,
    likes: 203,
  },
  {
    id: "4",
    name: "Dreamscape #015",
    collection: "Digital Dreams",
    image: "/images/n.png",
    price: 3.2,
    currency: "SOL",
    views: "980",
    listed: "30 min ago",
    verified: true,
    likes: 54,
  },
  {
    id: "5",
    name: "Neon Wanderer #305",
    collection: "Neon Realms",
    image: "/images/n2.png",
    price: 6.4,
    currency: "SOL",
    views: "1.2K",
    listed: "2 hours ago",
    verified: true,
    likes: 97,
  },
  {
    id: "6",
    name: "Phantom Bloom #076",
    collection: "Solana Spirits",
    image: "/images/n3.jpg",
    price: 4.9,
    currency: "SOL",
    views: "760",
    listed: "4 hours ago",
    verified: false,
    likes: 41,
  },
];

type NFTGridProps = {
  view?: "grid" | "list";
};

export default function NFTGrid({ view = "grid" }: NFTGridProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          : "grid grid-cols-1 gap-4"
      }
    >
      {mockNFTs.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
