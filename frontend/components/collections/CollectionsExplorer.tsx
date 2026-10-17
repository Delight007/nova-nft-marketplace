"use client";

import { useState } from "react";
import CollectionGrid from "./CollectionGrid";
import CollectionsSidebar from "./CollectionsSidebar";
import CollectionsTabs from "./CollectionsTabs";
export default function CollectionsExplorer() {
  const [activeTab, setActiveTab] = useState("All Collections");

  return (
    <section className=" container relative overflow-hidden border-b border-white/10 bg-[#020812]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 lg:py-10">
        <div className="grid grid-cols-[256px_minmax(0,1fr)] gap-8">
          {/* Sidebar */}
          <CollectionsSidebar />

          {/* Main content */}
          <div className="min-w-0">
            <CollectionsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <CollectionGrid activeTab={activeTab} />
          </div>
        </div>
      </div>
    </section>
  );
}
