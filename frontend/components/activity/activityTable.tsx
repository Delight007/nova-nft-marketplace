"use client";

import { useSolUsdPrice } from "@/hooks/use-sol-usd-price";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiExternalLink,
  FiMinus,
} from "react-icons/fi";
import { SiSolana } from "react-icons/si";
import type { ActivityItem, ActivityStatus, ActivityType } from "./activity";

type ActivityTableProps = {
  activities: ActivityItem[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

const eventStyles: Record<ActivityType, string> = {
  Sale: "bg-[#053c3b] text-[#00e4ba]",
  Listing: "bg-[#32105d] text-[#b06cff]",
  Delisting: "bg-[#4a2d08] text-[#ffb52e]",
  Mint: "bg-[#35125e] text-[#c06cff]",
};

const statusStyles: Record<ActivityStatus, string> = {
  Completed: "bg-[#043b35] text-[#00e4b6]",
  Active: "bg-[#073d70] text-[#22baff]",
  Delisted: "bg-[#4a2d08] text-[#ffbd43]",
  Minted: "bg-[#35125e] text-[#c06cff]",
};

function EventIcon({ type }: { type: ActivityType }) {
  if (type === "Sale") return <FiArrowUpRight />;
  if (type === "Listing") return <FiArrowUpRight />;
  if (type === "Delisting") return <FiArrowDownRight />;
  return <span className="text-[11px]">✦</span>;
}

function AddressCell({ address, label }: { address: string; label: string }) {
  return (
    <div className="min-w-[100px]">
      <p className="text-[11px] text-[#9db4e6]">{address}</p>
      <p className="mt-0.5 text-[10px] text-[#718dbe]">{label}</p>
    </div>
  );
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export function ActivityTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading marketplace activity"
      className="overflow-hidden rounded-2xl border border-[#1b3c76] bg-[#020c22]/80"
    >
      <div aria-hidden="true" className="animate-pulse overflow-x-auto">
        <table className="w-full min-w-[930px] border-collapse">
          <thead>
            <tr className="border-b border-[#173665] text-left">
              {[
                "Event",
                "NFT",
                "Collection",
                "From / To",
                "Price",
                "Status",
                "Time",
                "",
              ].map((heading, index) => (
                <th
                  key={`${heading}-${index}`}
                  className="px-3 py-4 text-[10px] font-medium text-[#718dc0]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-[#132d5c] last:border-0"
              >
                <td className="px-3 py-3">
                  <div className="h-6 w-16 rounded-full bg-[#173665]" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-[#173665]" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-[#173665]" />
                      <div className="h-2 w-14 rounded bg-[#132d5c]" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[#173665]" />
                    <div className="h-3 w-20 rounded bg-[#173665]" />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-2">
                    <div className="h-3 w-20 rounded bg-[#173665]" />
                    <div className="h-2 w-12 rounded bg-[#132d5c]" />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="h-3 w-12 rounded bg-[#173665]" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-6 w-16 rounded-full bg-[#173665]" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-3 w-14 rounded bg-[#173665]" />
                </td>
                <td className="px-3 py-3">
                  <div className="h-3 w-8 rounded bg-[#173665]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-hidden="true" className="h-4 bg-[#07152d]" />
      <div
        aria-hidden="true"
        className="flex items-center justify-between border-t border-[#173665] px-3 py-4"
      >
        <div className="h-3 w-36 animate-pulse rounded bg-[#173665]" />
        <div className="h-7 w-28 animate-pulse rounded-lg bg-[#173665]" />
      </div>
      <span className="sr-only">Loading marketplace activity...</span>
    </div>
  );
}

type ScrollbarMetrics = {
  trackWidth: number;
  thumbWidth: number;
  thumbLeft: number;
  maxScroll: number;
};

export default function ActivityTable({
  activities,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: ActivityTableProps) {
  const { data: solPrice } = useSolUsdPrice();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerX: number; scrollLeft: number } | null>(null);

  const [scrollbar, setScrollbar] = useState<ScrollbarMetrics>({
    trackWidth: 0,
    thumbWidth: 0,
    thumbLeft: 0,
    maxScroll: 0,
  });

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const track = scrollbarRef.current;

    if (!scrollArea || !track) return;

    const updateScrollbar = () => {
      const trackWidth = track.clientWidth;
      const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;

      const thumbWidth =
        maxScroll > 0
          ? Math.max(
              32,
              (scrollArea.clientWidth / scrollArea.scrollWidth) * trackWidth,
            )
          : trackWidth;

      const thumbTravel = Math.max(0, trackWidth - thumbWidth);
      const thumbLeft =
        maxScroll > 0 ? (scrollArea.scrollLeft / maxScroll) * thumbTravel : 0;

      setScrollbar({ trackWidth, thumbWidth, thumbLeft, maxScroll });
    };

    updateScrollbar();

    scrollArea.addEventListener("scroll", updateScrollbar, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scrollArea);
    resizeObserver.observe(track);

    return () => {
      scrollArea.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [activities.length]);

  const scrollToPointer = (pointerX: number, centerThumb: boolean) => {
    const scrollArea = scrollAreaRef.current;
    const track = scrollbarRef.current;

    if (!scrollArea || !track || scrollbar.maxScroll <= 0) return;

    const thumbTravel = scrollbar.trackWidth - scrollbar.thumbWidth;
    if (thumbTravel <= 0) return;

    const trackLeft = track.getBoundingClientRect().left;
    const offset =
      pointerX - trackLeft - (centerThumb ? scrollbar.thumbWidth / 2 : 0);

    const thumbLeft = Math.max(0, Math.min(thumbTravel, offset));

    scrollArea.scrollLeft = (thumbLeft / thumbTravel) * scrollbar.maxScroll;
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1b3c76] bg-[#020c22]/80">
      <div
        id="activity-table-scroll-area"
        ref={scrollAreaRef}
        className="scrollbar-hidden overflow-x-auto"
      >
        <table className="w-full min-w-[930px] border-collapse">
          <thead>
            <tr className="border-b border-[#173665] text-left">
              {[
                "Event",
                "NFT",
                "Collection",
                "From / To",
                "Price",
                "Status",
                "Time",
                "",
              ].map((heading, index) => (
                <th
                  key={`${heading}-${index}`}
                  className="px-3 py-4 text-[10px] font-medium text-[#718dc0]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <p className="text-sm font-medium text-white">
                    No activity found
                  </p>
                  <p className="mt-1 text-xs text-[#718bb9]">
                    Marketplace events matching your filters will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              activities.map((activity) => {
                const solAmount = activity.price?.sol;

                return (
                <tr
                  key={activity.id}
                  className="border-b border-[#132d5c] last:border-0 transition hover:bg-[#071735]/60"
                >
                  <td className="px-3 py-3">
                    <div
                      className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium ${eventStyles[activity.type]}`}
                    >
                      <EventIcon type={activity.type} />
                      {activity.type}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#294b86]">
                        <Image
                          src={activity.nft.image}
                          alt={activity.nft.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-[125px]">
                        <p className="truncate text-[11px] font-medium text-white">
                          {activity.nft.name}
                        </p>
                        <p className="mt-1 text-[10px] text-[#6886bc]">
                          {activity.nft.itemNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#354d9b]">
                        <Image
                          src={activity.collection.image}
                          alt={activity.collection.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#a7b9df]">
                          {activity.collection.name}
                        </span>

                        {activity.collection.verified && (
                          <span className="text-[9px] text-[#4c91ff]">✓</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {activity.from ? (
                        <AddressCell
                          address={activity.from.address}
                          label={activity.from.label}
                        />
                      ) : (
                        <FiMinus className="text-[#506d9d]" />
                      )}

                      {activity.to && (
                        <>
                          <span className="text-[#6481b6]">→</span>
                          <AddressCell
                            address={activity.to.address}
                            label={activity.to.label}
                          />
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    {activity.price ? (
                      <div className="flex flex-col gap-1">
                        <p className="flex items-center gap-1 text-[11px] font-medium text-white">
                          <SiSolana
                            aria-hidden="true"
                            className="text-blue-400"
                          />
                          {solAmount?.toLocaleString() ?? "—"}
                        </p>

                        {solPrice?.usd && (
                          <p className="text-[9px] text-[#718dbe]">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format((solAmount ?? 0) * solPrice.usd)}{" "}
                            USD
                          </p>
                        )}
                      </div>
                    ) : (
                      <FiMinus className="text-[#506d9d]" />
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1.5 text-[10px] font-medium ${statusStyles[activity.status]}`}
                    >
                      {activity.status}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="whitespace-nowrap text-[10px] text-[#7792c1]">
                      {formatTime(activity.createdAt ?? activity.time)}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    {activity.transactionSignature ? (
                      <a
                        href={`https://explorer.solana.com/tx/${activity.transactionSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-[#829ee0] transition hover:text-white"
                      >
                        View
                        <FiExternalLink className="text-[9px]" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#506d9d]">—</span>
                    )}
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        ref={scrollbarRef}
        role="scrollbar"
        aria-label="Scroll activity table horizontally"
        aria-controls="activity-table-scroll-area"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(
          (scrollbar.thumbLeft /
            Math.max(1, scrollbar.trackWidth - scrollbar.thumbWidth)) *
            100,
        )}
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            scrollToPointer(event.clientX, true);
          }
        }}
        onKeyDown={(event) => {
          const scrollArea = scrollAreaRef.current;
          if (!scrollArea) return;

          if (event.key === "ArrowLeft") scrollArea.scrollBy({ left: -120 });
          if (event.key === "ArrowRight") scrollArea.scrollBy({ left: 120 });
          if (event.key === "Home") scrollArea.scrollTo({ left: 0 });
          if (event.key === "End") {
            scrollArea.scrollTo({ left: scrollArea.scrollWidth });
          }
        }}
        className={`group flex h-4 cursor-pointer touch-none items-center bg-[#07152d] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300 ${
          scrollbar.maxScroll <= 0 ? "invisible" : ""
        }`}
      >
        <div
          role="presentation"
          onPointerDown={(event) => {
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = {
              pointerX: event.clientX,
              scrollLeft: scrollAreaRef.current?.scrollLeft ?? 0,
            };
          }}
          onPointerMove={(event) => {
            if (!dragRef.current) return;

            const scrollArea = scrollAreaRef.current;
            if (!scrollArea) return;

            const thumbTravel = scrollbar.trackWidth - scrollbar.thumbWidth;
            if (thumbTravel <= 0) return;

            const scrollDelta =
              ((event.clientX - dragRef.current.pointerX) / thumbTravel) *
              scrollbar.maxScroll;

            scrollArea.scrollLeft = dragRef.current.scrollLeft + scrollDelta;
          }}
          onPointerUp={(event) => {
            dragRef.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          style={{
            width: `${scrollbar.thumbWidth}px`,
            transform: `translateX(${scrollbar.thumbLeft}px)`,
          }}
          className="h-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.35)] transition-[height,box-shadow] group-hover:h-2 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.55)]"
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-[#173665] px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[#6986ba]">
          Showing {startItem}–{endItem} of {total} activities
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-xs text-[#6d88b9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
            const pageNumber =
              totalPages <= 5
                ? index + 1
                : Math.min(Math.max(page - 2, 1), totalPages - 4) + index;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] ${
                  page === pageNumber
                    ? "border-transparent bg-gradient-to-br from-[#7c35ff] to-[#4c4dff] text-white"
                    : "border-[#173d75] text-[#7590bf] hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="px-1 text-[#617cae]">...</span>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-[10px] text-[#7590bf] hover:text-white"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-xs text-[#6d88b9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
