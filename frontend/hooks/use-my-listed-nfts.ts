"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyListedNFTs } from "@/services/user";
export const MY_LISTED_NFTS_QUERY_KEY = ["myListedNFTs"] as const;

export function useMyListedNFTs(enabled = true) {
  return useQuery({
    queryKey: MY_LISTED_NFTS_QUERY_KEY,
    queryFn: getMyListedNFTs,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}
