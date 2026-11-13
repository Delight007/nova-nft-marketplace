"use client";

import { useState } from "react";

import ActivityCreateCta from "./activityCreateCta";
import ActivityFilters from "./activityFilters";
import ActivityTable, { ActivityTableSkeleton } from "./activityTable";
import ActivityTabs from "./activityTabs";
import LiveActivity from "./liveActivity";

import { useMarketplaceActivity } from "@/hooks/use-marketplace-activity";
import type { ActivityFilterState, ActivityType } from "./activity";
import RecentCollectionVolume from "./recentCollectionVolume";

const PAGE_SIZE = 10;

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"All" | ActivityType>("All");
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<ActivityFilterState>({
    types: [],
    collection: "All Collections",
    walletAddress: "",
    dateRange: "Last 7 days",
  });

  // const selectedTypes =
  //   activeTab === "All"
  //     ? filters.types
  //     : filters.types.length === 0 || filters.types.includes(activeTab)
  //       ? [activeTab]
  //       : [];

  const selectedTypes = activeTab === "All" ? filters.types : [activeTab];

  const { data, isLoading, isError, error } = useMarketplaceActivity({
    page,
    limit: PAGE_SIZE,
    collection: filters.collection,
    walletAddress: filters.walletAddress.trim(),
    types: selectedTypes,
    dateRange: filters.dateRange,
  });

  const handleFilterChange = (nextFilters: ActivityFilterState) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleTabChange = (tab: "All" | ActivityType) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#01091b] text-white">
      <div className="mx-auto max-w-[1550px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Activity
          </h1>

          <p className="mt-1 text-sm text-[#91b0e9]">
            Track the latest trades, mints, listings and more on Nova.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)_273px]">
          <ActivityFilters
            onFilterChange={handleFilterChange}
            collections={data?.collections ?? []}
            summary={data?.summary}
            isLoading={isLoading}
          />

          <section className="min-w-0">
            <div className="mb-4 border-t border-[#17335f] pt-3">
              <ActivityTabs activeTab={activeTab} onChange={handleTabChange} />
            </div>

            {isLoading ? (
              <ActivityTableSkeleton />
            ) : isError ? (
              <div className="rounded-2xl border border-red-900/60 bg-[#020c22]/80 px-4 py-12 text-center">
                <p className="text-sm font-medium text-white">
                  Unable to load marketplace activity.
                </p>
                <p className="mt-2 text-xs text-[#91b0e9]">
                  {error instanceof Error ? error.message : "Please try again."}
                </p>
              </div>
            ) : (
              <ActivityTable
                activities={data?.activities ?? []}
                page={data?.pagination.page ?? page}
                totalPages={data?.pagination.totalPages ?? 0}
                total={data?.pagination.total ?? 0}
                limit={data?.pagination.limit ?? PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </section>

          <aside className="space-y-4">
            <LiveActivity summary={data?.summary} isLoading={isLoading} />
            <RecentCollectionVolume />
            <ActivityCreateCta />
          </aside>
        </div>
      </div>
    </main>
  );
}
