"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MY_COLLECTED_NFTS_QUERY_KEY } from "@/hooks/use-my-collected-nfts";
import { MY_LISTED_NFTS_QUERY_KEY } from "@/hooks/use-my-listed-nfts";
import { cancelNFTListing } from "@/services/listing";

export function useCancelNFTListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nftId,
      transactionSignature,
    }: {
      nftId: string;
      transactionSignature: string;
    }) =>
      cancelNFTListing(nftId, {
        transactionSignature,
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: MY_COLLECTED_NFTS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({
          queryKey: MY_LISTED_NFTS_QUERY_KEY,
        }),
      ]);
    },
  });
}
