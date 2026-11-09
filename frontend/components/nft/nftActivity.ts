import type { NFTDetailsData } from "@/services/nfts";

export type NFTActivityEvent = {
  id: string;
  kind: "mint" | "list" | "offer" | "sale" | "cancel" | "transfer" | "other";
  title: string;
  participant: string;
  createdAt: string;
  avatar: string | null;
  price: number | null;
  currency: string | null;
};

export function getNFTActivityEvents(nft: NFTDetailsData): NFTActivityEvent[] {
  const salesSignatures = new Set(
    nft.sales.map((sale) => sale.transactionSignature),
  );
  const events: NFTActivityEvent[] = nft.activities
    .filter(
      (activity) =>
        activity.type !== "SALE" ||
        !activity.transactionSignature ||
        !salesSignatures.has(activity.transactionSignature),
    )
    .map((activity) => {
      const kind =
        activity.type === "MINTED"
          ? "mint"
          : activity.type === "LISTED"
            ? "list"
            : activity.type === "OFFER_MADE"
              ? "offer"
              : activity.type === "DELISTED"
                ? "cancel"
                : activity.type === "TRANSFER"
                  ? "transfer"
                  : activity.type === "SALE"
                    ? "sale"
                    : "other";

      return {
        id: `activity-${activity.id}`,
        kind,
        title:
          kind === "mint"
            ? "Minted"
            : kind === "list"
              ? "Listed for sale"
              : kind === "offer"
                ? "Offer placed"
                : kind === "sale"
                  ? "Sold"
                  : kind === "cancel"
                    ? "Listing cancelled"
                    : kind === "transfer"
                      ? "Transferred"
                      : activity.type,
        participant:
          kind === "mint"
            ? activity.user?.username ||
              activity.user?.wallet ||
              nft.creator.username ||
              nft.creator.wallet
            : activity.user?.wallet ?? "Unknown address",
        createdAt: activity.createdAt,
        avatar:
          kind === "mint"
            ? activity.user?.avatar ?? nft.creator.avatar
            : null,
        price: activity.price,
        currency: activity.currency,
      };
    });

  events.push(
    ...nft.offers.map((offer) => ({
      id: `offer-${offer.id}`,
      kind: "offer" as const,
      title: "Offer placed",
      participant: offer.maker.wallet,
      createdAt: offer.createdAt,
      avatar: null,
      price: offer.amount,
      currency: offer.currency,
    })),
    ...nft.sales.map((sale) => ({
      id: `sale-${sale.id}`,
      kind: "sale" as const,
      title: "Sold",
      participant: sale.buyer.wallet,
      createdAt: sale.createdAt,
      avatar: null,
      price: sale.price,
      currency: sale.currency,
    })),
  );

  if (
    nft.mintAddress &&
    !events.some((event) => event.kind === "mint")
  ) {
    events.push({
      id: "minted-fallback",
      kind: "mint",
      title: "Minted",
      participant: nft.creator.username || nft.creator.wallet,
      createdAt: nft.createdAt,
      avatar: nft.creator.avatar,
      price: null,
      currency: null,
    });
  }

  return events.sort(
    (first, second) =>
      new Date(first.createdAt).getTime() -
      new Date(second.createdAt).getTime(),
  );
}

export function getActivityDescription(event: NFTActivityEvent) {
  if (event.kind === "sale") return `Sold to ${event.participant}`;
  if (event.kind === "mint") return `Minted by ${event.participant}`;
  if (event.kind === "list") return `Listed for sale by ${event.participant}`;
  if (event.kind === "offer") return `Offer placed by ${event.participant}`;
  if (event.kind === "cancel") return `Listing cancelled by ${event.participant}`;
  if (event.kind === "transfer") return `Transferred by ${event.participant}`;
  return `${event.title} by ${event.participant}`;
}
