import { FiBox, FiGift, FiRepeat, FiShoppingBag } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

import type { ActivityType } from "./activity";
import { liveActivityData } from "./activityData";

const icons: Record<ActivityType, React.ReactNode> = {
  Sale: <FiShoppingBag />,
  Listing: <FiBox />,
  Offer: <FiGift />,
  Transfer: <FiRepeat />,
  Mint: <HiOutlineSparkles />,
};

const iconStyles: Record<ActivityType, string> = {
  Sale: "bg-[#32105d] text-[#c36cff]",
  Listing: "bg-[#112b64] text-[#65aaff]",
  Offer: "bg-[#4a2e0c] text-[#ffb432]",
  Transfer: "bg-[#073e63] text-[#00caff]",
  Mint: "bg-[#37125d] text-[#c96cff]",
};

export default function LiveActivity() {
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
        {liveActivityData.map((item) => (
          <div
            key={item.type}
            className="flex items-center justify-between border-b border-[#17335f] py-2.5 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${iconStyles[item.type]}`}
              >
                {icons[item.type]}
              </div>

              <span className="text-xs text-[#d1dcf3]">{item.type}s</span>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-[#00e4b3]">
                +{item.count}
              </p>
              <p className="mt-0.5 text-[10px] text-[#7892c1]">
                ${item.volume.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
