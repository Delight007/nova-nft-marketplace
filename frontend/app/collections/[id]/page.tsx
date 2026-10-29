"use client";

import CollectionDetails from "@/components/collections/collectionDetails";
import CollectionItems from "@/components/collections/CollectionItems";
import { useEffect, useState } from "react";

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};

export default function CollectionPage({ params }: CollectionPageProps) {
  const [slug, setSlug] = useState("");
  const [paramsError, setParamsError] = useState(false);

  useEffect(() => {
    let active = true;

    void params.then(
      ({ id }) => {
        if (active) setSlug(id);
      },
      () => {
        if (active) setParamsError(true);
      },
    );

    return () => {
      active = false;
    };
  }, [params]);

  return (
    <main>
      {paramsError && (
        <p className="container bg-[#020812] py-4 text-center text-sm text-rose-400">
          Unable to load this collection route.
        </p>
      )}
      <CollectionDetails slug={slug} />
      <CollectionItems slug={slug} />
    </main>
  );
}
