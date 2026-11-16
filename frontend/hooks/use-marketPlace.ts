import {
  getFeaturedCollections,
  getMarketplaceNFTs,
  getMarketplaceStats,
  type MarketplaceNFTFilters,
} from "@/services/marketplace";
import { useQuery } from "@tanstack/react-query";

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  stats: () => [...marketplaceKeys.all, "stats"] as const,
  featured: () => [...marketplaceKeys.all, "featured"] as const,
  nfts: (filters: MarketplaceNFTFilters) =>
    [...marketplaceKeys.all, "nfts", filters] as const,
};

const FEATURED_NFT_FILTERS: MarketplaceNFTFilters = {
  page: 1,
  limit: 4,
  search: "",
  category: "All",
  collection: "",
  verified: false,
  status: [],
  minPrice: null,
  maxPrice: null,
  sort: "recent",
};

export function useMarketplaceStats() {
  return useQuery({
    queryKey: marketplaceKeys.stats(),
    queryFn: getMarketplaceStats,
  });
}

export function useFeaturedCollections() {
  return useQuery({
    queryKey: marketplaceKeys.featured(),
    queryFn: getFeaturedCollections,
  });
}

export function useMarketplaceNFTs(filters: MarketplaceNFTFilters) {
  return useQuery({
    queryKey: marketplaceKeys.nfts(filters),
    queryFn: () => getMarketplaceNFTs(filters),
  });
}

export function useFeaturedNFTs() {
  return useMarketplaceNFTs(FEATURED_NFT_FILTERS);
}
