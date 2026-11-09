"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MY_COLLECTED_NFTS_QUERY_KEY } from "@/hooks/use-my-collected-nfts";
import { MY_LISTED_NFTS_QUERY_KEY } from "@/hooks/use-my-listed-nfts";
import { createNFTListing } from "@/services/listing";

export function useCreateNFTListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nftId,
      transactionSignature,
    }: {
      nftId: string;
      transactionSignature: string;
    }) =>
      createNFTListing(nftId, {
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
