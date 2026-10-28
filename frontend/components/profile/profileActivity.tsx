"use client";

import Link from "next/link";
import { useMyActivity } from "@/hooks/use-my-activity";
import type { ProfileActivity } from "@/services/user";
import { FaExternalLinkAlt, FaHistory } from "react-icons/fa";
function getActivityLabel(type: ProfileActivity["type"]) {
  const labels: Record<ProfileActivity["type"], string> = {
    MINTED: "Created",
    LISTED: "Listed for sale",
    DELISTED: "Removed from sale",
    SALE: "Sale",
    OFFER_MADE: "Made an offer",
    OFFER_ACCEPTED: "Offer accepted",
    OFFER_CANCELLED: "Offer cancelled",
    TRANSFER: "Transferred",
  };

  return labels[type];
}

function getActivityColor(type: ProfileActivity["type"]) {
  if (type === "SALE" || type === "OFFER_ACCEPTED") {
    return "text-emerald-400";
  }

  if (type === "DELISTED" || type === "OFFER_CANCELLED") {
    return "text-amber-400";
  }

  return "text-purple-400";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProfileActivity() {
  const { data, isLoading, isError, refetch } = useMyActivity();

  const activities = data?.activities ?? [];

  return (
    <section className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Activity</h2>
        <p className="mt-1 text-sm text-slate-400">
          Your recent NFT activity on the marketplace.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-white/10 p-8 text-center">
          <p className="text-slate-300">Could not load your activity.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm hover:bg-purple-500"
          >
            Try again
          </button>
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
          <FaHistory className="mx-auto text-2xl text-slate-500" />
          <h3 className="mt-4 font-semibold">No activity yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Your recorded NFT actions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/nft/${encodeURIComponent(activity.nft.mintAddress)}`}
                className="flex min-w-0 flex-1 items-center gap-4"
              >
                <img
                  src={activity.nft.image}
                  alt={activity.nft.name}
                  className="h-16 w-16 shrink-0 rounded-lg bg-white/5 object-cover"
                />

                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${getActivityColor(activity.type)}`}
                  >
                    {getActivityLabel(activity.type)}
                  </p>

                  <h3 className="mt-1 truncate font-semibold text-white">
                    {activity.nft.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {activity.nft.collection?.name ?? "Uncategorized"}
                  </p>
                </div>
              </Link>

              <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-white">
                    {activity.price !== null
                      ? `${activity.price} ${activity.currency ?? ""}`.trim()
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>

                {activity.transactionSignature && (
                  <a
                    href={`https://explorer.solana.com/tx/${encodeURIComponent(activity.transactionSignature)}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View transaction on Solana Explorer"
                    className="text-slate-400 transition hover:text-white"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
