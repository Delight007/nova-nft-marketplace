import {
  FiBox,
  FiShoppingBag,
  FiXCircle,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

import type { ActivityType } from "./activity";
import type { MarketplaceActivitySummary } from "@/services/activity";

type LiveActivityProps = {
  summary?: MarketplaceActivitySummary;
  isLoading?: boolean;
};

const eventTypes: ActivityType[] = [
  "Sale",
  "Listing",
  "Delisting",
  "Mint",
];

const icons: Record<ActivityType, React.ReactNode> = {
  Sale: <FiShoppingBag />,
  Listing: <FiBox />,
  Delisting: <FiXCircle />,
  Mint: <HiOutlineSparkles />,
};

const iconStyles: Record<ActivityType, string> = {
  Sale: "bg-[#32105d] text-[#c36cff]",
  Listing: "bg-[#112b64] text-[#65aaff]",
  Delisting: "bg-[#4a2e0c] text-[#ffb432]",
  Mint: "bg-[#37125d] text-[#c96cff]",
};

const labels: Record<ActivityType, string> = {
  Sale: "Sales",
  Listing: "Listings",
  Delisting: "Delistings",
  Mint: "Mints",
};

export default function LiveActivity({
  summary,
  isLoading = false,
}: LiveActivityProps) {
  return (
    <section className="rounded-2xl border border-[#173d75] bg-[#030d24]/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Live Activity</h2>

        <div className="flex items-center gap-1.5 text-[10px] text-[#8ba8d9]">
          <span className="h-2 w-2 rounded-full bg-[#00e0a5]" />
          Solana Network
        </div>
      </div>

      <div className="border-t border-[#17335f]">
        {eventTypes.map((type) => {
          const item = summary?.[type];

          return (
            <div
              key={type}
              className="flex items-center justify-between border-b border-[#17335f] py-2.5 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${iconStyles[type]}`}
                >
                  {icons[type]}
                </div>

                <span className="text-xs text-[#d1dcf3]">
                  {labels[type]}
                </span>
              </div>

              <div className="text-right">
                {isLoading ? (
                  <div
                    aria-hidden="true"
                    className="animate-pulse space-y-1.5"
                  >
                    <div className="ml-auto h-3 w-7 rounded bg-[#173665]" />
                    <div className="ml-auto h-2.5 w-14 rounded bg-[#132d5c]" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-[#00e4b3]">
                      {item?.count ?? 0}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#7892c1]">
                      {type === "Sale"
                        ? `◎ ${(item?.volume ?? 0).toLocaleString()} SOL`
                        : "—"}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
