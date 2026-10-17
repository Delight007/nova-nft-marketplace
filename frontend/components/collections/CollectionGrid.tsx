"use client";

import CollectionCard from "./CollectionCard";
import { collections } from "./collectionsData";

type CollectionGridProps = {
  activeTab: string;
};

export default function CollectionGrid({ activeTab }: CollectionGridProps) {
  const filteredCollections = collections.filter((collection) => {
    if (activeTab === "Verified") {
      return collection.verified;
    }

    return true;
  });

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredCollections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
