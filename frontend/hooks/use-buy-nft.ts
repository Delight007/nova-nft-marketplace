"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MY_COLLECTED_NFTS_QUERY_KEY } from "@/hooks/use-my-collected-nfts";
import { MY_LISTED_NFTS_QUERY_KEY } from "@/hooks/use-my-listed-nfts";
import { collectionDetailKeys } from "@/hooks/use-collection-details";
import { completeNFTPurchase } from "@/services/listing";

type BuyNFTPayload = {
  nftId: string;
  transactionSignature: string;
  collectionSlug?: string;
};

export function useBuyNFT() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nftId, transactionSignature }: BuyNFTPayload) =>
      completeNFTPurchase(nftId, { transactionSignature }),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: MY_COLLECTED_NFTS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: MY_LISTED_NFTS_QUERY_KEY,
        }),
        ...(variables.collectionSlug
          ? [
              queryClient.invalidateQueries({
                queryKey: collectionDetailKeys.detail(
                  variables.collectionSlug,
                ),
              }),
            ]
          : []),
      ]);
    },
  });
}
