export type NFTItem = {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  status: "Buy Now" | "Listed";
  listedDaysAgo: number;
  owners: string;
  verified: boolean;
  traits: {
    Background: string;
    Eyes: string;
    Headwear: string;
    Clothing: string;
    Accessories: string;
  };
};

export const nftItems: NFTItem[] = [
  {
    id: "0427",
    name: "Neon Soul",
    collection: "Neon Realms",
    image: "/images/nfts/neon-soul.png",
    price: 12.5,
    rarity: "Legendary",
    status: "Buy Now",
    listedDaysAgo: 1,
    owners: "6.4K",
    verified: true,
    traits: {
      Background: "Cyberpunk",
      Eyes: "Neon Blue",
      Headwear: "None",
      Clothing: "Streetwear",
      Accessories: "Visor",
    },
  },
  {
    id: "1189",
    name: "Skyward Isles",
    collection: "Neon Realms",
    image: "/images/nfts/skyward-isles.png",
    price: 8.3,
    rarity: "Epic",
    status: "Buy Now",
    listedDaysAgo: 2,
    owners: "4.2K",
    verified: true,
    traits: {
      Background: "Sky Islands",
      Eyes: "None",
      Headwear: "None",
      Clothing: "None",
      Accessories: "Floating Castle",
    },
  },
  {
    id: "3201",
    name: "Cyber Phantom",
    collection: "Neon Realms",
    image: "/images/nfts/cyber-phantom.png",
    price: 6.7,
    rarity: "Rare",
    status: "Listed",
    listedDaysAgo: 3,
    owners: "3.1K",
    verified: true,
    traits: {
      Background: "Neon City",
      Eyes: "Purple",
      Headwear: "Hood",
      Clothing: "Dark Armor",
      Accessories: "Mask",
    },
  },
  {
    id: "5710",
    name: "Digital Bloom",
    collection: "Neon Realms",
    image: "/images/nfts/digital-bloom.png",
    price: 4.2,
    rarity: "Uncommon",
    status: "Buy Now",
    listedDaysAgo: 4,
    owners: "2.8K",
    verified: true,
    traits: {
      Background: "Sunset",
      Eyes: "Blue",
      Headwear: "None",
      Clothing: "Jacket",
      Accessories: "Glasses",
    },
  },
  {
    id: "6937",
    name: "Lava Horizon",
    collection: "Neon Realms",
    image: "/images/nfts/lava-horizon.png",
    price: 5.8,
    rarity: "Rare",
    status: "Buy Now",
    listedDaysAgo: 5,
    owners: "3.6K",
    verified: false,
    traits: {
      Background: "Volcanic",
      Eyes: "None",
      Headwear: "None",
      Clothing: "None",
      Accessories: "Red Moon",
    },
  },
  {
    id: "2468",
    name: "Neo Tokyo",
    collection: "Neon Realms",
    image: "/images/nfts/neo-tokyo.png",
    price: 9.4,
    rarity: "Epic",
    status: "Buy Now",
    listedDaysAgo: 6,
    owners: "4.9K",
    verified: false,
    traits: {
      Background: "Neo Tokyo",
      Eyes: "None",
      Headwear: "None",
      Clothing: "None",
      Accessories: "Flying Car",
    },
  },
  {
    id: "1092",
    name: "Astral Queen",
    collection: "Neon Realms",
    image: "/images/nfts/astral-queen.png",
    price: 15,
    rarity: "Legendary",
    status: "Buy Now",
    listedDaysAgo: 7,
    owners: "7.2K",
    verified: true,
    traits: {
      Background: "Moonlight",
      Eyes: "Violet",
      Headwear: "Crown",
      Clothing: "Royal Armor",
      Accessories: "Magic Staff",
    },
  },
  {
    id: "7721",
    name: "The Forgotten",
    collection: "Neon Realms",
    image: "/images/nfts/the-forgotten.png",
    price: 3.9,
    rarity: "Uncommon",
    status: "Buy Now",
    listedDaysAgo: 8,
    owners: "2.1K",
    verified: false,
    traits: {
      Background: "Sky Islands",
      Eyes: "None",
      Headwear: "None",
      Clothing: "None",
      Accessories: "Waterfall",
    },
  },
];

export const rarityColors: Record<NFTItem["rarity"], string> = {
  Common: "bg-slate-500/20 text-slate-300 border-slate-400/20",
  Uncommon: "bg-emerald-500/15 text-emerald-400 border-emerald-400/20",
  Rare: "bg-sky-500/15 text-sky-400 border-sky-400/20",
  Epic: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  Legendary: "bg-amber-500/15 text-amber-400 border-amber-400/30",
};

export const rarityCounts: Record<NFTItem["rarity"], string> = {
  Common: "4,320",
  Uncommon: "3,120",
  Rare: "1,980",
  Epic: "780",
  Legendary: "280",
};

export const traitOptions: Record<keyof NFTItem["traits"], string[]> = {
  Background: [
    "Cyberpunk",
    "Sky Islands",
    "Neon City",
    "Sunset",
    "Volcanic",
    "Moonlight",
  ],
  Eyes: ["Neon Blue", "Purple", "Blue", "Violet"],
  Headwear: ["Hood", "Crown"],
  Clothing: ["Streetwear", "Dark Armor", "Jacket", "Royal Armor"],
  Accessories: [
    "Visor",
    "Floating Castle",
    "Mask",
    "Glasses",
    "Red Moon",
    "Flying Car",
    "Magic Staff",
    "Waterfall",
  ],
};

export type CollectionItemsTab = "Items" | "Activity" | "Offers";
