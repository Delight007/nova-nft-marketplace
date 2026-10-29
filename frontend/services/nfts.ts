import api from "@/lib/axios";

export type NFTDetailsData = {
  id: string;
  mintAddress: string;
  name: string;
  description: string | null;
  image: string;
  metadataUri: string | null;
  attributes: unknown;
  createdAt: string;
  updatedAt: string;

  owner: {
    id: string;
    wallet: string;
    username: string | null;
    avatar: string | null;
  };

  creator: {
    id: string;
    wallet: string;
    username: string | null;
    avatar: string | null;
  };

  collection: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    banner: string | null;
    verified: boolean;
  } | null;

  listing: {
    id: string;
    price: number;
    currency: string;
    status: string;
    listedAt: string;
    seller: {
      wallet: string;
      username: string | null;
      avatar: string | null;
    };
  } | null;

  sales: Array<{
    id: string;
    price: number;
    currency: string;
    createdAt: string;
    buyer: {
      wallet: string;
      username: string | null;
      avatar: string | null;
    };
    seller: {
      wallet: string;
      username: string | null;
      avatar: string | null;
    };
  }>;

  activities: Array<{
    id: string;
    type: string;
    price: number | null;
    currency: string | null;
    transactionSignature: string | null;
    createdAt: string;
    user: {
      wallet: string;
      username: string | null;
      avatar: string | null;
    } | null;
  }>;

  offers: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    expiresAt: string | null;
    createdAt: string;
    maker: {
      wallet: string;
      username: string | null;
      avatar: string | null;
    };
  }>;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getNFTById(id: string): Promise<NFTDetailsData> {
  const response = await api.get<ApiResponse<NFTDetailsData>>(
    `/api/nfts/${encodeURIComponent(id)}`,
  );

  return response.data.data;
}
