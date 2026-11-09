import api from "@/lib/axios";

export type CreateListingPayload = {
  transactionSignature: string;
};

export type CreateListingResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    nftId: string;
    price: number;
    currency: string;
    status: string;
    transactionSignature: string;
    listedAt: string;
    listingAddress: string;
  };
};

export async function createNFTListing(
  nftId: string,
  payload: CreateListingPayload,
) {
  const response = await api.post<CreateListingResponse>(
    `/api/nfts/${nftId}/listings`,
    payload,
  );

  return response.data.data;
}

export type CancelListingPayload = {
  transactionSignature: string;
};

export type CancelListingResponse = {
  success: boolean;
  message: string;
  data: {
    id?: string;
    nftId: string;
    price?: number;
    currency?: string;
    status: string;
    transactionSignature: string;
    listingAddress?: string;
  };
};

export async function cancelNFTListing(
  nftId: string,
  payload: CancelListingPayload,
) {
  const response = await api.post<CancelListingResponse>(
    `/api/nfts/${nftId}/listings/cancel`,
    payload,
  );

  return response.data.data;
}

export type BuyNFTResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    nftId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    currency: string;
    transactionSignature: string;
    createdAt: string;
    listingAddress?: string;
  };
};

export async function completeNFTPurchase(
  nftId: string,
  payload: { transactionSignature: string },
) {
  const response = await api.post<BuyNFTResponse>(
    `/api/nfts/${nftId}/buy`,
    payload,
  );

  return response.data.data;
}
