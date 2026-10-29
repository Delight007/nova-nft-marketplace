"use client";

import type { Trait } from "@/components/createNft/createNft";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateNFTPayload {
  name: string;
  description: string;
  image: string;
  attributes: Trait[];
}

interface CreateNFTResponse {
  success: boolean;
  message: string;
  nft: {
    id: string;
    mintAddress: string | null;
    name: string;
    description: string | null;
    image: string;
    creatorId: string;
    ownerId: string;
    createdAt: string;
  };
}

async function createNFT(
  payload: CreateNFTPayload,
): Promise<CreateNFTResponse> {
  const response = await api.post<CreateNFTResponse>("/api/nfts", payload);

  return response.data;
}

export function useCreateNFT() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNFT,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-profile-stats"],
      });
    },
  });
}
