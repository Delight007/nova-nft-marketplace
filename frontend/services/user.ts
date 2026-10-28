import { api } from "@/lib/axios";
import axios from "axios";

export type UserProfile = {
  id: string;
  wallet: string;
  username: string | null;
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CollectedNFT = {
  id: string;
  mintAddress: string;
  name: string;
  description: string | null;
  image: string;
  metadataUri: string | null;
  attributes: unknown;
  createdAt: string;
  collection: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    verified: boolean;
  } | null;
  listing: {
    id: string;
    price: string;
    currency: string;
    listedAt: string;
  } | null;
};

type CollectedNFTsResponse = {
  success: boolean;
  message?: string;
  data: {
    nfts: CollectedNFT[];
    total: number;
  };
};

type ProfileResponse = {
  success: boolean;
  message?: string;
  data: {
    user: UserProfile;
  };
};

export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get<ProfileResponse>("/api/users/me");
  return response.data.data.user;
}

export async function updateMyProfile(values: {
  username?: string;
  avatar?: string;
  banner?: string;
  bio?: string | null;
  website?: string;
  twitter?: string;
  discord?: string;
}): Promise<UserProfile> {
  const response = await api.patch<ProfileResponse>("/api/users/me", values);

  return response.data.data.user;
}

export function getProfileErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;

    return responseData?.message ?? "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export async function getMyCollectedNFTs(): Promise<{
  nfts: CollectedNFT[];
  total: number;
}> {
  const response = await api.get<CollectedNFTsResponse>("/api/users/me/nfts");

  return response.data.data;
}

export async function getMyCreatedNFTs(): Promise<{
  nfts: CollectedNFT[];
  total: number;
}> {
  const response = await api.get<CollectedNFTsResponse>(
    "/api/users/me/created-nfts",
  );

  return response.data.data;
}

export async function getMyListedNFTs(): Promise<{
  nfts: CollectedNFT[];
  total: number;
}> {
  const response = await api.get<CollectedNFTsResponse>(
    "/api/users/me/listed-nfts",
  );

  return response.data.data;
}

export type ProfileActivity = {
  id: string;
  type:
    | "MINTED"
    | "LISTED"
    | "DELISTED"
    | "SALE"
    | "OFFER_MADE"
    | "OFFER_ACCEPTED"
    | "OFFER_CANCELLED"
    | "TRANSFER";
  price: string | null;
  currency: string | null;
  transactionSignature: string | null;
  createdAt: string;
  nft: {
    id: string;
    mintAddress: string;
    name: string;
    image: string;
    collection: {
      id: string;
      name: string;
      slug: string;
      verified: boolean;
    } | null;
  };
};

type ProfileActivityResponse = {
  success: boolean;
  message?: string;
  data: {
    activities: ProfileActivity[];
    total: number;
  };
};

export async function getMyActivity(): Promise<{
  activities: ProfileActivity[];
  total: number;
}> {
  const response = await api.get<ProfileActivityResponse>(
    "/api/users/me/activity",
  );

  return response.data.data;
}

export type CreatorAnalytics = {
  period: "30d";
  volume: number;
  currency: string;
  sales: number;
  uniqueBuyers: number;
  chart: {
    date: string;
    volume: number;
  }[];
};

type CreatorAnalyticsResponse = {
  success: boolean;
  message?: string;
  data: CreatorAnalytics;
};

export async function getMyCreatorAnalytics(): Promise<CreatorAnalytics> {
  const response = await api.get<CreatorAnalyticsResponse>(
    "/api/users/me/creator-analytics",
  );

  return response.data.data;
}

export type TopCollection = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  verified: boolean;
  itemCount: number;
  volume: number;
};

type TopCollectionsResponse = {
  success: boolean;
  message?: string;
  data: TopCollection[];
};

export async function getMyTopCollections(): Promise<TopCollection[]> {
  const response = await api.get<TopCollectionsResponse>(
    "/api/users/me/top-collections",
  );

  return response.data.data;
}
