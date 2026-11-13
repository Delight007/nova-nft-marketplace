import api from "@/lib/axios";

export type MarketplaceActivityType = "Sale" | "Listing" | "Delisting" | "Mint";

export type MarketplaceActivityItem = {
  id: string;
  type: MarketplaceActivityType;
  nft: {
    id: string;
    name: string;
    itemNumber: string;
    image: string;
  };
  collection: {
    name: string;
    image: string;
    verified: boolean;
  };
  from?: {
    address: string;
    label: string;
  };
  to?: {
    address: string;
    label: string;
  };
  price?: {
    sol: number;
  };
  status: "Completed" | "Active" | "Delisted" | "Minted";
  time: string;
  transactionSignature: string | null;
  createdAt: string;
};

export type MarketplaceActivitySummary = {
  Sale: { count: number; volume: number };
  Listing: { count: number; volume: number };
  Delisting: { count: number; volume: number };
  Mint: { count: number; volume: number };
};

export type MarketplaceActivityResponse = {
  activities: MarketplaceActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: MarketplaceActivitySummary;
  collections: {
    id: string;
    name: string;
  }[];
};

export type MarketplaceActivityParams = {
  page?: number;
  limit?: number;
  collection?: string;
  walletAddress?: string;
  types?: string[];
  dateRange?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getMarketplaceActivity(
  params: MarketplaceActivityParams = {},
): Promise<MarketplaceActivityResponse> {
  const response = await api.get<ApiResponse<MarketplaceActivityResponse>>(
    "/api/marketplace/activity",
    {
      params: {
        ...params,
        types: params.types?.join(","),
      },
    },
  );

  return response.data.data;
}

export type RecentCollectionVolume = {
  id: string;
  name: string;
  image: string | null;
  verified: boolean;
  volume: number;
  salesCount: number;
  changePercent: number | null;
};

export async function getRecentCollectionVolume(): Promise<
  RecentCollectionVolume[]
> {
  const response = await api.get<ApiResponse<RecentCollectionVolume[]>>(
    "/api/marketplace/collection-volumes",
  );

  return response.data.data;
}

export type SolUsdPrice = {
  usd: number;
  updatedAt: string;
};

export async function getSolUsdPrice(): Promise<SolUsdPrice> {
  const response = await api.get<ApiResponse<SolUsdPrice>>(
    "/api/marketplace/sol-price",
  );

  return response.data.data;
}
