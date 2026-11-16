"use client";

import Link from "next/link";
import { useMarketplaceActivity } from "@/hooks/use-marketplace-activity";
import { FiRefreshCw } from "react-icons/fi";

const REFRESH_INTERVAL = 30_000;

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (elapsedSeconds < 60) return `${elapsedSeconds}s`;

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes}m`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h`;

  return `${Math.floor(elapsedHours / 24)}d`;
}

function getActivityVerb(type: string) {
  switch (type) {
    case "Sale":
      return "purchased";
    case "Listing":
      return "listed";
    case "Delisting":
      return "delisted";
    case "Mint":
      return "minted";
    default:
      return "interacted with";
  }
}

export default function LiveActivities() {
  const { data, isPending, isError, error, refetch } = useMarketplaceActivity(
    { page: 1, limit: 6 },
    { refetchInterval: REFRESH_INTERVAL },
  );
  const activities = data?.activities ?? [];

  return (
    <section className="min-w-0 rounded-xl border border-blue-950 bg-[#050e1d] p-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Live Activity</h2>

        {isError ? (
          <button
            type="button"
            onClick={() => void refetch()}
            className="flex items-center gap-1.5 text-[11px] font-medium text-red-300 hover:text-red-200"
          >
            <FiRefreshCw aria-hidden="true" />
            Retry
          </button>
        ) : isPending ? (
          <span className="text-[11px] text-slate-400">Connecting</span>
        ) : (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Updates every 30s
          </span>
        )}
      </div>

      {isError ? (
        <p role="alert" className="py-4 text-xs text-red-200">
          Could not load marketplace activity
          {error instanceof Error ? `: ${error.message}` : "."}
        </p>
      ) : isPending ? (
        <div aria-label="Loading live activity" className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-20 rounded bg-slate-800" />
                <div className="h-2 w-32 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="py-4 text-xs text-slate-400">
          No marketplace activity yet.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex min-w-0 items-center gap-3"
            >
              <Link
                href={`/nft/${encodeURIComponent(activity.nft.id)}`}
                aria-label={`View ${activity.nft.name}`}
                className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0b1830]"
              >
                {activity.nft.image && (
                  <img
                    src={activity.nft.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-slate-300">
                  {activity.from?.address ?? activity.to?.address ?? "A collector"}
                </p>

                <p className="mt-0.5 truncate text-[10px] leading-4 text-slate-400">
                  {getActivityVerb(activity.type)}{" "}
                  <Link
                    href={`/nft/${encodeURIComponent(activity.nft.id)}`}
                    className="text-blue-300 hover:text-cyan-200"
                  >
                    {activity.nft.name}
                  </Link>
                  {activity.price && ` · ${activity.price.sol} SOL`}
                </p>
              </div>

              <span className="shrink-0 self-start pt-0.5 text-[10px] text-slate-500">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
