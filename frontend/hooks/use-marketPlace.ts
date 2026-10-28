import {
  getFeaturedCollections,
  getMarketplaceStats,
} from "@/services/marketplace";
import { useQuery } from "@tanstack/react-query";

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  stats: () => [...marketplaceKeys.all, "stats"] as const,
  featured: () => [...marketplaceKeys.all, "featured"] as const,
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
