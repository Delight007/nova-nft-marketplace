"use client";

import { getMyCreatorAnalytics } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const MY_CREATOR_ANALYTICS_QUERY_KEY = ["myCreatorAnalytics"] as const;

export function useMyCreatorAnalytics() {
  return useQuery({
    queryKey: MY_CREATOR_ANALYTICS_QUERY_KEY,
    queryFn: getMyCreatorAnalytics,
    retry: false,
    staleTime: 30_000,
  });
}
