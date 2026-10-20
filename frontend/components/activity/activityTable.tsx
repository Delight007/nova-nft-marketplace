"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiExternalLink,
  FiMinus,
} from "react-icons/fi";
import type { ActivityItem, ActivityStatus, ActivityType } from "./activity";

type ActivityTableProps = {
  activities: ActivityItem[];
};

const eventStyles: Record<ActivityType, string> = {
  Sale: "bg-[#053c3b] text-[#00e4ba]",
  Listing: "bg-[#32105d] text-[#b06cff]",
  Offer: "bg-[#4a2d08] text-[#ffb52e]",
  Transfer: "bg-[#073f62] text-[#00c8ff]",
  Mint: "bg-[#35125e] text-[#c06cff]",
};

const statusStyles: Record<ActivityStatus, string> = {
  Completed: "bg-[#043b35] text-[#00e4b6]",
  Active: "bg-[#073d70] text-[#22baff]",
  Pending: "bg-[#49340e] text-[#ffbd43]",
  Confirmed: "bg-[#043b35] text-[#00e4b6]",
  Accepted: "bg-[#36106d] text-[#c477ff]",
  Minted: "bg-[#35125e] text-[#c06cff]",
};

function EventIcon({ type }: { type: ActivityType }) {
  if (type === "Sale") return <FiArrowUpRight />;
  if (type === "Listing") return <FiArrowUpRight />;
  if (type === "Offer") return <FiArrowDownRight />;
  if (type === "Transfer") return <FiArrowUpRight />;
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

type ScrollbarMetrics = {
  trackWidth: number;
  thumbWidth: number;
  thumbLeft: number;
  maxScroll: number;
};

export default function ActivityTable({ activities }: ActivityTableProps) {
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
        maxScroll > 0
          ? (scrollArea.scrollLeft / maxScroll) * thumbTravel
          : 0;

      setScrollbar({ trackWidth, thumbWidth, thumbLeft, maxScroll });
    };

    updateScrollbar();
    scrollArea.addEventListener("scroll", updateScrollbar, { passive: true });
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
      pointerX -
      trackLeft -
      (centerThumb ? scrollbar.thumbWidth / 2 : 0);
    const thumbLeft = Math.max(0, Math.min(thumbTravel, offset));
    scrollArea.scrollLeft = (thumbLeft / thumbTravel) * scrollbar.maxScroll;
  };

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
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                Event
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                NFT
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                Collection
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                From / To
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                Price
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                Status
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]">
                Time
              </th>
              <th className="px-3 py-4 text-[10px] font-medium text-[#718dc0]" />
            </tr>
          </thead>

          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="border-b border-[#132d5c] last:border-0 transition hover:bg-[#071735]/60"
              >
                {/* Event */}
                <td className="px-3 py-3">
                  <div
                    className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium ${eventStyles[activity.type]}`}
                  >
                    <EventIcon type={activity.type} />
                    {activity.type}
                  </div>
                </td>

                {/* NFT */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#294b86]">
                      <Image
                        src={activity.nft.image}
                        alt={activity.nft.name}
                        fill
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

                {/* Collection */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#354d9b]">
                      <Image
                        src={activity.collection.image}
                        alt={activity.collection.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#a7b9df]">
                          {activity.collection.name}
                        </span>

                        {activity.collection.verified && (
                          <span className="text-[9px] text-[#4c91ff]">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* From / To */}
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

                {/* Price */}
                <td className="px-3 py-3">
                  {activity.price ? (
                    <div>
                      <p className="text-[11px] font-medium text-white">
                        ◎ {activity.price.sol}
                      </p>

                      {activity.price.usd !== undefined && (
                        <p className="mt-1 text-[10px] text-[#718cbd]">
                          ≈ ${activity.price.usd.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <FiMinus className="text-[#506d9d]" />
                  )}
                </td>

                {/* Status */}
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1.5 text-[10px] font-medium ${statusStyles[activity.status]}`}
                  >
                    {activity.status}
                  </span>
                </td>

                {/* Time */}
                <td className="px-3 py-3">
                  <span className="whitespace-nowrap text-[10px] text-[#7792c1]">
                    {activity.time}
                  </span>
                </td>

                {/* View */}
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[10px] text-[#829ee0] transition hover:text-white"
                  >
                    View
                    <FiExternalLink className="text-[9px]" />
                  </button>
                </td>
              </tr>
            ))}
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
          if (event.key === "End")
            scrollArea.scrollTo({ left: scrollArea.scrollWidth });
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

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-[#173665] px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[#6986ba]">
          Showing 10 of 342 activities
        </p>

        <div className="flex items-center gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-xs text-[#6d88b9]">
            ‹
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] ${
                page === 1
                  ? "border-transparent bg-gradient-to-br from-[#7c35ff] to-[#4c4dff] text-white"
                  : "border-[#173d75] text-[#7590bf] hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-[#617cae]">...</span>

          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-[10px] text-[#7590bf]">
            36
          </button>

          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#173d75] text-xs text-[#6d88b9]">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
