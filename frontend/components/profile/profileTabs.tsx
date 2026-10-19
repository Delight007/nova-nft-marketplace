"use client";

import { FaEdit, FaRegClock, FaTag, FaThLarge } from "react-icons/fa";

const tabs = [
  {
    name: "Collected",
    icon: FaThLarge,
    active: true,
  },
  {
    name: "Created",
    icon: FaEdit,
    active: false,
  },
  {
    name: "Listed",
    icon: FaTag,
    active: false,
  },
  {
    name: "Activity",
    icon: FaRegClock,
    active: false,
  },
];

export default function ProfileTabs() {
  return (
    <div className="border-b border-white/10">
      <div className="flex items-center gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              className={`relative flex shrink-0 items-center gap-3 py-5 text-sm transition ${
                tab.active
                  ? "font-semibold text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon
                className={tab.active ? "text-purple-400" : "text-slate-500"}
              />

              {tab.name}

              {tab.active && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-purple-500 to-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
