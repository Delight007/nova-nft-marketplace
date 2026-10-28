import { getCollections } from "@/services/collections";
import { useQuery } from "@tanstack/react-query";

export const collectionKeys = {
  all: ["collections"] as const,
  list: () => [...collectionKeys.all, "list"] as const,
};

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.list(),
    queryFn: getCollections,
  });
}
