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

export interface UpdateNFTMintPayload {
  nftId: string;
  mintAddress: string;
  metadataUri: string;
}

interface UpdateNFTMintResponse {
  success: boolean;
  message: string;
  nft: {
    id: string;
    mintAddress: string;
    metadataUri: string;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
}

async function updateNFTMint({
  nftId,
  mintAddress,
  metadataUri,
}: UpdateNFTMintPayload): Promise<UpdateNFTMintResponse> {
  const response = await api.patch<UpdateNFTMintResponse>(
    `/api/nfts/${nftId}/mint`,
    {
      mintAddress,
      metadataUri,
    },
  );

  return response.data;
}

export function useUpdateNFTMint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNFTMint,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-profile-stats"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-profile"],
        }),
      ]);
    },
  });
}
