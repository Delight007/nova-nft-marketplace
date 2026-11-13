export type ActivityType = "Sale" | "Listing" | "Delisting" | "Mint";

export type ActivityStatus =
  | "Completed"
  | "Active"
  | "Delisted"
  | "Minted";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  nft: {
    id?: string;
    name: string;
    itemNumber: string;
    image: string;
  };
  collection: {
    name: string;
    image: string;
    verified: boolean;
  };
  from?: {
    address: string;
    label: string;
  };
  to?: {
    address: string;
    label: string;
  };
  price?: {
    sol?: number;
    usd?: number;
  };
  status: ActivityStatus;
  time: string;
  transactionSignature?: string | null;
  createdAt?: string;
}

export interface ActivityFilterState {
  types: ActivityType[];
  collection: string;
  walletAddress: string;
  dateRange: string;
}

export interface LiveActivityItem {
  type: ActivityType;
  count: number;
  volume: number;
}

export interface CollectionVolume {
  rank: number;
  name: string;
  image: string;
  volume: number;
  change: number;
}
