import api from "@/lib/axios";

export type MarketplaceStats = {
  totalCollections: number;
  totalNFTs: number;
  totalCreators: number;
};

export type FeaturedCollection = {
  id: string;
  name: string;
  slug: string;
  creator: string;
  banner: string | null;
  subtitle: string;
  items: number;
  verified: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  const response = await api.get<ApiResponse<MarketplaceStats>>(
    "/api/marketplace/stats",
  );

  return response.data.data;
}

export async function getFeaturedCollections(): Promise<FeaturedCollection[]> {
  const response = await api.get<ApiResponse<FeaturedCollection[]>>(
    "/api/marketplace/featured",
  );

  return response.data.data;
}
