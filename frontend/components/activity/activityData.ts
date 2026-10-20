import { ActivityItem, CollectionVolume, LiveActivityItem } from "./activity";

export const activityData: ActivityItem[] = [
  {
    id: "1",
    type: "Sale",
    nft: {
      name: "Cyber Soul #1189",
      itemNumber: "Item #1189",
      image: "/images/nfts/cyber-soul.jpg",
    },
    collection: {
      name: "Neon Realms",
      image: "/images/collections/neon-realms.jpg",
      verified: true,
    },
    from: {
      address: "0x8a3f...91c2",
      label: "Buyer",
    },
    to: {
      address: "0x4f2e...7b9a",
      label: "Seller",
    },
    price: {
      sol: 8.3,
      usd: 1240,
    },
    status: "Completed",
    time: "2m ago",
  },

  {
    id: "2",
    type: "Listing",
    nft: {
      name: "Ape Ascend #2047",
      itemNumber: "Item #2047",
      image: "/images/nfts/ape-ascend.jpg",
    },
    collection: {
      name: "Ape Society",
      image: "/images/collections/ape-society.jpg",
      verified: true,
    },
    from: {
      address: "0x7c9e...3d1f",
      label: "Seller",
    },
    price: {
      sol: 5.5,
      usd: 820,
    },
    status: "Active",
    time: "12m ago",
  },

  {
    id: "3",
    type: "Offer",
    nft: {
      name: "Pixel Nomad #331",
      itemNumber: "Item #331",
      image: "/images/nfts/pixel-nomad.jpg",
    },
    collection: {
      name: "The Forgotten",
      image: "/images/collections/the-forgotten.jpg",
      verified: true,
    },
    from: {
      address: "0x5e2a...6c7e",
      label: "Buyer",
    },
    to: {
      address: "0x14ab...9f8d",
      label: "Seller",
    },
    price: {
      sol: 4.2,
      usd: 630,
    },
    status: "Pending",
    time: "18m ago",
  },

  {
    id: "4",
    type: "Transfer",
    nft: {
      name: "Sky Islands #2047",
      itemNumber: "Item #2047",
      image: "/images/nfts/sky-islands.jpg",
    },
    collection: {
      name: "Sky Islands",
      image: "/images/collections/sky-islands.jpg",
      verified: true,
    },
    from: {
      address: "0x3d7f...e2a1",
      label: "From",
    },
    to: {
      address: "0x6b6c...4f9e",
      label: "To",
    },
    status: "Confirmed",
    time: "25m ago",
  },

  {
    id: "5",
    type: "Mint",
    nft: {
      name: "Neon Dreams #0421",
      itemNumber: "Item #0421",
      image: "/images/nfts/neon-dreams.jpg",
    },
    collection: {
      name: "Neon Realms",
      image: "/images/collections/neon-realms.jpg",
      verified: true,
    },
    from: {
      address: "0x9f11...2c6d",
      label: "Creator",
    },
    status: "Minted",
    time: "31m ago",
  },

  {
    id: "6",
    type: "Sale",
    nft: {
      name: "Shadow Guard #7765",
      itemNumber: "Item #7765",
      image: "/images/nfts/shadow-guard.jpg",
    },
    collection: {
      name: "The Forgotten",
      image: "/images/collections/the-forgotten.jpg",
      verified: true,
    },
    from: {
      address: "0x7a3c...5e1d",
      label: "Buyer",
    },
    to: {
      address: "0x2f9e...8b4a",
      label: "Seller",
    },
    price: {
      sol: 12,
      usd: 1790,
    },
    status: "Completed",
    time: "42m ago",
  },

  {
    id: "7",
    type: "Listing",
    nft: {
      name: "Dream Weaver #5192",
      itemNumber: "Item #0033",
      image: "/images/nfts/dream-weaver.jpg",
    },
    collection: {
      name: "Aurora",
      image: "/images/collections/aurora.jpg",
      verified: true,
    },
    from: {
      address: "0x6d4e...1a7b",
      label: "Seller",
    },
    price: {
      sol: 7.8,
      usd: 1165,
    },
    status: "Active",
    time: "1h ago",
  },

  {
    id: "8",
    type: "Sale",
    nft: {
      name: "Aurora #2210",
      itemNumber: "Item #2210",
      image: "/images/nfts/aurora.jpg",
    },
    collection: {
      name: "Aurora",
      image: "/images/collections/aurora.jpg",
      verified: true,
    },
    from: {
      address: "0x2c8f...6e9a",
      label: "From",
    },
    to: {
      address: "0x5c3f...3e4a",
      label: "Seller",
    },
    price: {
      sol: 6.5,
      usd: 970,
    },
    status: "Accepted",
    time: "2h ago",
  },
];

export const liveActivityData: LiveActivityItem[] = [
  {
    type: "Sale",
    count: 12,
    volume: 18420,
  },
  {
    type: "Listing",
    count: 8,
    volume: 9120,
  },
  {
    type: "Offer",
    count: 6,
    volume: 5340,
  },
  {
    type: "Transfer",
    count: 14,
    volume: 7860,
  },
  {
    type: "Mint",
    count: 3,
    volume: 2340,
  },
];

export const collectionVolumeData: CollectionVolume[] = [
  {
    rank: 1,
    name: "Neon Realms",
    image: "/images/collections/neon-realms.jpg",
    volume: 12.8,
    change: 24.5,
  },
  {
    rank: 2,
    name: "Ape Society",
    image: "/images/collections/ape-society.jpg",
    volume: 8.7,
    change: 18.2,
  },
  {
    rank: 3,
    name: "The Forgotten",
    image: "/images/collections/the-forgotten.jpg",
    volume: 7.1,
    change: 9.3,
  },
  {
    rank: 4,
    name: "Sky Islands",
    image: "/images/collections/sky-islands.jpg",
    volume: 5.4,
    change: 12.6,
  },
  {
    rank: 5,
    name: "Aurora",
    image: "/images/collections/aurora.jpg",
    volume: 4.8,
    change: 7.8,
  },
];
