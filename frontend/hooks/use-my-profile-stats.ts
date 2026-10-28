"use client";

import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type ProfileStats = {
  ownedNFTs: number;
  createdNFTs: number;
  listedNFTs: number;
  volumeTraded: string;
  followers: number;
};

type ProfileStatsResponse = {
  success: boolean;
  data: {
    stats: ProfileStats;
  };
};

export const MY_PROFILE_STATS_QUERY_KEY = ["myProfileStats"] as const;

async function getMyProfileStats(): Promise<ProfileStats> {
  const response = await api.get<ProfileStatsResponse>("/api/users/me/stats");
  return response.data.data.stats;
}

export function useMyProfileStats() {
  return useQuery({
    queryKey: MY_PROFILE_STATS_QUERY_KEY,
    queryFn: getMyProfileStats,
    retry: false,
    staleTime: 30_000,
  });
}
