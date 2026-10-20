"use client";

import CollectedNfts from "@/components/profile/collectedNfts";
import CreatorAnalytics from "@/components/profile/creatorAnalytics";
import ProfileHero from "@/components/profile/profileHero";
import ProfileTabs from "@/components/profile/profileTabs";
import TopCollections from "@/components/profile/topCollections";
import ProfileSocials from "./profileSocial";

export default function ProfilePage() {
  return (
    <section className="container min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ProfileHero />

        <div className="mx-auto max-w-[1500px] px-6">
          <ProfileTabs />

          <div className="grid grid-cols-1 gap-5 pb-20 lg:grid-cols-[minmax(0,1fr)_365px]">
            {/* MAIN CONTENT */}
            <section className="min-w-0">
              <CollectedNfts />
            </section>

            {/* SIDEBAR */}
            <aside className="space-y-5 border-l border-white/5 pl-0 lg:pl-5">
              <CreatorAnalytics />

              <TopCollections />

              <ProfileSocials />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
