"use client";

import { getRecentCollectionVolume } from "@/services/activity";
import { useQuery } from "@tanstack/react-query";

export function useRecentCollectionVolume() {
  return useQuery({
    queryKey: ["recent-collection-volume"],
    queryFn: getRecentCollectionVolume,
    staleTime: 30_000,
    retry: false,
  });
}
