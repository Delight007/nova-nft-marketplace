"use client";

import { getMyTopCollections } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const MY_TOP_COLLECTIONS_QUERY_KEY = ["myTopCollections"] as const;

export function useMyTopCollections() {
  return useQuery({
    queryKey: MY_TOP_COLLECTIONS_QUERY_KEY,
    queryFn: getMyTopCollections,
    retry: false,
    staleTime: 30_000,
  });
}
