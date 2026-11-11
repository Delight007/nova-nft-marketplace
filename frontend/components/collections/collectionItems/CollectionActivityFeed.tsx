"use client";

import { useCollectionActivity } from "@/hooks/use-collection-activity";
import type { CollectionActivityEvent } from "@/services/collections";
import {
  FiActivity,
  FiClock,
  FiExternalLink,
  FiImage,
  FiRefreshCw,
} from "react-icons/fi";

function getEventLabel(type: CollectionActivityEvent["type"]) {
  switch (type) {
    case "MINTED":
      return "Minted";
    case "LISTED":
      return "Listed for sale";
    case "DELISTED":
      return "Listing cancelled";
    case "SALE":
      return "Sale";
    case "OFFER_MADE":
      return "Offer made";
    case "OFFER_ACCEPTED":
      return "Offer accepted";
    case "OFFER_CANCELLED":
      return "Offer cancelled";
    case "TRANSFER":
      return "Transferred";
    default:
      return "Activity";
  }
}

function shortenWallet(wallet: string) {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function getParticipant(event: CollectionActivityEvent) {
  if (event.type === "SALE") {
    return event.buyer;
  }

  return event.user;
}

function ActivityRow({ event }: { event: CollectionActivityEvent }) {
  const participant = getParticipant(event);

  const participantName = participant?.username
    ? `@${participant.username}`
    : participant?.wallet
      ? shortenWallet(participant.wallet)
      : "Unknown wallet";

  const description =
    event.type === "SALE"
      ? `Purchased by ${participantName}`
      : event.type === "MINTED"
        ? `Minted by ${participantName}`
        : event.type === "LISTED"
          ? `Listed by ${participantName}`
          : event.type === "DELISTED"
            ? `Delisted by ${participantName}`
            : `${getEventLabel(event.type)} by ${participantName}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#030b19] p-4 transition hover:border-purple-500/30 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {event.nft.image ? (
            <img
              src={event.nft.image}
              alt={event.nft.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <FiImage size={20} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {event.nft.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {getEventLabel(event.type)}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {description}
          </p>

          {event.type === "SALE" && event.seller && (
            <p className="mt-1 truncate text-xs text-slate-500">
              Seller:{" "}
              {event.seller.username
                ? `@${event.seller.username}`
                : shortenWallet(event.seller.wallet)}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          {event.price !== null && (
            <p className="text-sm font-semibold text-white">
              {event.price.toLocaleString(undefined, {
                maximumFractionDigits: 9,
              })}{" "}
              {event.currency ?? ""}
            </p>
          )}

          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
            <FiClock size={12} />
            {formatDate(event.createdAt)}
          </p>
        </div>

        {event.transactionSignature && (
          <a
            href={`https://explorer.solana.com/tx/${encodeURIComponent(
              event.transactionSignature,
            )}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-purple-400 transition hover:text-purple-300"
          >
            Transaction <FiExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function CollectionActivityFeed({ slug }: { slug: string }) {
  const { data, isPending, isError, error, refetch } =
    useCollectionActivity(slug);

  if (isPending) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-white/10 bg-[#030b19]">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <FiRefreshCw className="animate-spin" />
          Loading collection activity...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#030b19] px-6 text-center">
        <FiActivity size={24} className="text-rose-400" />

        <p className="mt-3 text-sm text-rose-400">
          {error instanceof Error
            ? error.message
            : "Unable to load collection activity."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-xs text-white transition hover:bg-white/5"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#030b19] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300">
          <FiActivity size={22} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          No Activity Yet
        </h3>

        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
          Minting, listings, sales and other collection events will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {data.length} {data.length === 1 ? "event" : "events"}
        </p>
      </div>

      {data.map((event) => (
        <ActivityRow key={event.id} event={event} />
      ))}
    </div>
  );
}
