// import api from "@/lib/axios";

// export type Collection = {
//   id: string;
//   name: string;
//   slug: string;
//   creator: string;
//   creatorAvatar: string | null;
//   banner: string | null;
//   items: number;
//   floorPrice: number;
//   volume: number;
//   verified: boolean;
//   isNew: boolean;
//   activeTrading: boolean;
// };

// type ApiResponse<T> = {
//   success: boolean;
//   data: T;
// };

// export async function getCollections(): Promise<Collection[]> {
//   const response = await api.get<ApiResponse<Collection[]>>("/api/collections");

//   return response.data.data;
// }

import api from "@/lib/axios";

export type Collection = {
  id: string;
  name: string;
  slug: string;
  creator: string;
  creatorAvatar: string | null;
  banner: string | null;
  items: number;
  floorPrice: number;
  volume: number;
  verified: boolean;
  isNew: boolean;
  activeTrading: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getCollections(): Promise<Collection[]> {
  const response = await api.get<ApiResponse<Collection[]>>("/api/collections");

  return response.data.data;
}

// Collection detail types

export type CollectionDetailsData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  verified: boolean;
  createdAt: string;
  creator: string;
  creatorWallet: string;
  creatorAvatar: string | null;
  stats: {
    items: number;
    owners: number;
    ownerPercentage: number;
    floorPrice: number | null;
    floorCurrency: string;
    volume24h: number;
    volumeChange: number | null;
  };
  nfts: CollectionNFT[];
};

export type CollectionNFT = {
  id: string;
  mintAddress: string;
  name: string;
  description: string | null;
  image: string;
  metadataUri: string | null;
  attributes: unknown;
  createdAt: string;
  ownerWallet: string;
  listing: {
    id: string;
    price: number;
    currency: string;
    seller: string;
    listedAt: string;
  } | null;
};

export async function getCollectionBySlug(
  slug: string,
): Promise<CollectionDetailsData> {
  const response = await api.get<ApiResponse<CollectionDetailsData>>(
    `/api/collections/${encodeURIComponent(slug)}`,
  );

  return response.data.data;
}
