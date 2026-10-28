"use client";

import { getMyCollectedNFTs } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const MY_COLLECTED_NFTS_QUERY_KEY = ["myCollectedNFTs"] as const;

export function useMyCollectedNFTs(enabled = true) {
  return useQuery({
    queryKey: MY_COLLECTED_NFTS_QUERY_KEY,
    queryFn: getMyCollectedNFTs,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}
