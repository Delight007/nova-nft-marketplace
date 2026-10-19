export const nft = {
  id: "1189",
  name: "Cyber Soul #1189",
  collection: "Neon Realms",
  creator: "NeonCreators",
  handle: "@neoncreators",
  owner: "0x8a3f...91e7",
  price: "8.3",
  usdPrice: "$1,240.50",
  lastSale: "7.6 SOL",
  floor: "3.2 SOL",
  description:
    "A digital soul from the Neon Realms collection. Each piece represents a unique moment in the intersection of humanity and technology.",
  royalty: "7.5%",
  marketplaceFee: "2.5%",
};

export const images = [
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=1200&q=90",
];

export const traits = [
  { name: "Background", value: "Neon City", rarity: "54%" },
  { name: "Eyes", value: "Cyber Glasses", rarity: "32%" },
  { name: "Hair", value: "Blue Bun", rarity: "12%" },
  { name: "Skin", value: "Cool Tone", rarity: "28%" },
  { name: "Rarity", value: "Legendary", rarity: "1%" },
  { name: "Type", value: "PFP", rarity: "100%" },
];

export const activity = [
  {
    title: "Minted",
    detail: "by NeonCreators",
    date: "Mar 12, 2025 · 2:14 PM",
    type: "mint",
  },
  {
    title: "Listed for sale",
    detail: "by 0x8a3f...91e7",
    date: "Mar 15, 2025 · 4:32 PM",
    type: "list",
  },
  {
    title: "Offer placed",
    detail: "by 0x7e1a...4c9b",
    date: "Mar 16, 2025 · 10:21 AM",
    type: "offer",
  },
  {
    title: "Sold",
    detail: "to 0x5c2d...8f3e",
    date: "Mar 18, 2025 · 6:47 PM",
    type: "sold",
  },
];

export const tabs = ["Details", "Properties", "Traits", "Activity"] as const;
export type NFTDetailsTab = (typeof tabs)[number];
