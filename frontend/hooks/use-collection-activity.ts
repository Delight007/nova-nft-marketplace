"use client";

import { getCollectionActivity } from "@/services/collections";
import { useQuery } from "@tanstack/react-query";

export const collectionActivityKeys = {
  all: ["collection-activity"] as const,
  detail: (slug: string) => [...collectionActivityKeys.all, slug] as const,
};

export function useCollectionActivity(slug: string) {
  return useQuery({
    queryKey: collectionActivityKeys.detail(slug),
    queryFn: () => getCollectionActivity(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
    retry: false,
  });
}
