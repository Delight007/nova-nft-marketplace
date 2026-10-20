"use client";

import { useMemo, useState } from "react";

import ActivityCreateCta from "./activityCreateCta";
import ActivityFilters from "./activityFilters";
import ActivityTable from "./activityTable";
import LiveActivity from "./liveActivity";
import RecentCollectionVolume from "./recentCollectionVolume";
import ActivityTabs from "./activityTabs";

import type { ActivityFilterState, ActivityType } from "./activity";
import { activityData } from "./activityData";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"All" | ActivityType>("All");

  const [filters, setFilters] = useState<ActivityFilterState>({
    types: [],
    collection: "All Collections",
    walletAddress: "",
    dateRange: "Last 7 days",
  });

  const filteredActivities = useMemo(() => {
    return activityData.filter((activity) => {
      // Tab filter
      if (activeTab !== "All" && activity.type !== activeTab) {
        return false;
      }

      // Event type filter
      if (filters.types.length > 0 && !filters.types.includes(activity.type)) {
        return false;
      }

      // Collection filter
      if (
        filters.collection !== "All Collections" &&
        activity.collection.name !== filters.collection
      ) {
        return false;
      }

      // Wallet filter
      if (filters.walletAddress.trim()) {
        const search = filters.walletAddress.toLowerCase().trim();

        const fromAddress = activity.from?.address.toLowerCase() ?? "";

        const toAddress = activity.to?.address.toLowerCase() ?? "";

        if (!fromAddress.includes(search) && !toAddress.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, filters]);

  return (
    <main className="min-h-screen bg-[#01091b] text-white">
      <div className="mx-auto max-w-[1550px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Activity
          </h1>

          <p className="mt-1 text-sm text-[#91b0e9]">
            Track the latest trades, mints, listings and more on Nova.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)_273px]">
          {/* LEFT */}
          <ActivityFilters onFilterChange={setFilters} />

          {/* CENTER */}
          <section className="min-w-0">
            <div className="mb-4 border-t border-[#17335f] pt-3">
              <ActivityTabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <ActivityTable activities={filteredActivities} />
          </section>

          {/* RIGHT */}
          <aside className="space-y-4">
            <LiveActivity />
            <RecentCollectionVolume />
            <ActivityCreateCta />
          </aside>
        </div>
      </div>
    </main>
  );
}
