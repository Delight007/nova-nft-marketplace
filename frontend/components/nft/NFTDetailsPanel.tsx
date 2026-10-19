import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import NFTActivityTab from "./NFTActivityTab";
import NFTOverviewTab from "./NFTOverviewTab";
import NFTPropertiesTab from "./NFTPropertiesTab";
import NFTTraitsTab from "./NFTTraitsTab";
import { tabs } from "./nftDetailsData";
import type { NFTDetailsTab } from "./nftDetailsData";

type NFTDetailsPanelProps = {
  onAction: (message: string) => void;
};

export default function NFTDetailsPanel({ onAction }: NFTDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<NFTDetailsTab>("Details");

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18]">
      <div className="flex items-center justify-between overflow-x-auto border-b border-[#142541] px-4 md:px-5">
        <div className="flex gap-5 md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap py-5 text-sm transition ${
                activeTab === tab
                  ? "font-semibold text-white"
                  : "text-blue-300 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => onAction("More details coming soon")}
          aria-label="More details"
          className="ml-4 shrink-0 text-blue-300 hover:text-cyan-300"
        >
          <FiArrowUpRight />
        </button>
      </div>

      {activeTab === "Details" && (
        <NFTOverviewTab
          onAction={onAction}
          onShowProperties={() => setActiveTab("Properties")}
          onShowActivity={() => setActiveTab("Activity")}
        />
      )}
      {activeTab === "Properties" && <NFTPropertiesTab />}
      {activeTab === "Traits" && <NFTTraitsTab />}
      {activeTab === "Activity" && <NFTActivityTab />}
    </section>
  );
}
