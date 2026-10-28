export type FeaturedCollection = {
  id: number;
  name: string;
  creator: string;
  banner: string;
  subtitle: string;
  items: string;
  verified: boolean;
};

export const featuredCollections: FeaturedCollection[] = [
  {
    id: 1,
    name: "Neon Realms",
    creator: "NeonCreators",
    banner: "/images/b.png",
    subtitle: "10,000 unique digital art pieces",
    items: "10,000",
    verified: true,
  },
  {
    id: 2,
    name: "Cyber Genesis",
    creator: "CyberCreator",
    banner: "/images/b2.jpg",
    subtitle: "7,500 futuristic digital identities",
    items: "7,500",
    verified: true,
  },
  {
    id: 3,
    name: "Astral Worlds",
    creator: "AstralLabs",
    banner: "/images/b3.jpg",
    subtitle: "5,000 cosmic characters and artifacts",
    items: "5,000",
    verified: true,
  },
  {
    id: 4,
    name: "Future Cities",
    creator: "FutureLabs",
    banner: "/images/b4.jpg",
    subtitle: "8,888 futuristic digital worlds",
    items: "8,888",
    verified: true,
  },
];

export type CollectionHeroStats = {
  totalCollections: number;
  totalNFTs: number;
  totalCreators: number;
};

// Temporary values until the backend endpoint is ready.
export const sampleCollectionHeroStats: CollectionHeroStats = {
  totalCollections: 500,
  totalNFTs: 1_200_000,
  totalCreators: 28_000,
};
