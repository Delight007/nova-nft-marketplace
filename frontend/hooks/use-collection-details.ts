import { getCollectionBySlug } from "@/services/collections";
import { useQuery } from "@tanstack/react-query";

export const collectionDetailKeys = {
  all: ["collection-details"] as const,
  detail: (slug: string) => [...collectionDetailKeys.all, slug] as const,
};

export function useCollectionDetails(slug: string) {
  return useQuery({
    queryKey: collectionDetailKeys.detail(slug),
    queryFn: () => getCollectionBySlug(slug),
    enabled: Boolean(slug),
  });
}
