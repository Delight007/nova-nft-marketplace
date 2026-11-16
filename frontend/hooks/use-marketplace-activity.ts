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
  options: { refetchInterval?: number } = {},
) {
  return useQuery({
    queryKey: marketplaceActivityKeys.list(params),
    queryFn: () => getMarketplaceActivity(params),
    staleTime: options.refetchInterval ?? 30_000,
    refetchInterval: options.refetchInterval,
    retry: false,
  });
}
