"use client";

import { getMarketplaceActivity } from "@/services/activity";
import { useQuery } from "@tanstack/react-query";
import type { MarketplaceActivityParams } from "@/services/activity";

export const marketplaceActivityKeys = {
  all: ["marketplace-activity"] as const,
  list: (params: MarketplaceActivityParams) =>
    [...marketplaceActivityKeys.all, params] as const,
};

export function useMarketplaceActivity(
  params: MarketplaceActivityParams = {},
) {
  return useQuery({
    queryKey: marketplaceActivityKeys.list(params),
    queryFn: () => getMarketplaceActivity(params),
    staleTime: 30_000,
    retry: false,
  });
}
