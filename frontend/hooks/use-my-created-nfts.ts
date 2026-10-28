"use client";

import { getMyCreatedNFTs } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const MY_CREATED_NFTS_QUERY_KEY = ["myCreatedNFTs"] as const;

export function useMyCreatedNFTs(enabled = true) {
  return useQuery({
    queryKey: MY_CREATED_NFTS_QUERY_KEY,
    queryFn: getMyCreatedNFTs,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}
