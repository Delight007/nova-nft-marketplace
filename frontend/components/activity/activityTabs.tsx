"use client";

import type { ActivityType } from "./activity";

type ActivityTab = "All" | ActivityType;

type ActivityTabsProps = {
  activeTab: ActivityTab;
  onChange: (tab: ActivityTab) => void;
};

const tabs: ActivityTab[] = [
  "All",
  "Sale",
  "Listing",
  "Offer",
  "Transfer",
  "Mint",
];

export default function ActivityTabs({
  activeTab,
  onChange,
}: ActivityTabsProps) {
  return (
    <div className="flex items-center gap-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`relative shrink-0 pb-3 text-xs transition ${
            activeTab === tab
              ? "font-semibold text-white"
              : "text-[#7894c8] hover:text-white"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#9b3cff] to-[#0ddcff]" />
          )}
        </button>
      ))}
    </div>
  );
}