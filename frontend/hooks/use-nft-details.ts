import { useQuery } from "@tanstack/react-query";
import { getNFTById } from "../services/nfts";

export const nftKeys = {
  all: ["nfts"] as const,
  details: (id: string) => [...nftKeys.all, "details", id] as const,
};

export function useNFTDetails(id: string) {
  return useQuery({
    queryKey: nftKeys.details(id),
    queryFn: () => getNFTById(id),
    enabled: Boolean(id),
  });
}
