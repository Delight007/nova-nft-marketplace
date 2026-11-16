import api from "@/lib/axios";

export type MarketplaceStats = {
  totalVolume: number;
  totalCollections: number;
  totalNFTs: number;
  totalCreators: number;
  growth?: {
    totalVolume: number | null;
    totalCollections: number | null;
    totalNFTs: number | null;
    totalCreators: number | null;
  };
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

export type MarketplaceNFT = {
  id: string;
  mintAddress: string | null;
  name: string;
  description: string | null;
  image: string;
  attributes: unknown;
  createdAt: string;
  ownerWallet: string;
  collection: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    verified: boolean;
  } | null;
  listing: {
    price: number;
    currency: string;
    listedAt: string;
  } | null;
};

export type MarketplaceNFTFilters = {
  page: number;
  limit: number;
  search: string;
  category: string;
  collection: string;
  verified: boolean;
  status: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: string;
};

export type MarketplaceNFTPage = {
  nfts: MarketplaceNFT[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getMarketplaceNFTs(
  filters: MarketplaceNFTFilters,
): Promise<MarketplaceNFTPage> {
  const response = await api.get<ApiResponse<MarketplaceNFTPage>>(
    "/api/marketplace/nfts",
    {
      params: {
        ...filters,
        status: filters.status.join(","),
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
      },
    },
  );

  return response.data.data;
}

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
