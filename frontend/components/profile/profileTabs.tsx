"use client";

import { FaEdit, FaRegClock, FaTag, FaThLarge } from "react-icons/fa";

export type ProfileTabName = "Collected" | "Created" | "Listed" | "Activity";

const tabs = [
  { name: "Collected", icon: FaThLarge },
  { name: "Created", icon: FaEdit },
  { name: "Listed", icon: FaTag },
  { name: "Activity", icon: FaRegClock },
] as const;

interface ProfileTabsProps {
  activeTab: ProfileTabName;
  onTabChange: (tab: ProfileTabName) => void;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div className="border-b border-white/10">
      <div className="flex items-center gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => onTabChange(tab.name)}
              className={`relative flex shrink-0 items-center gap-3 py-5 text-sm transition ${
                isActive
                  ? "font-semibold text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon
                className={isActive ? "text-purple-400" : "text-slate-500"}
              />

              {tab.name}

              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-purple-500 to-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
