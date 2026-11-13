"use client";

import CollectionDetails from "@/components/collections/collectionDetails";
import CollectionItems from "@/components/collections/CollectionItems";
import { useCollectionDetails } from "@/hooks/use-collection-details";
import { useEffect, useState } from "react";

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};

function CollectionPageSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading collection page"
      className="min-h-screen bg-[#020817] text-white"
    >
      <section
        aria-hidden="true"
        className="container animate-pulse border-b border-white/10 bg-[#020812]"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[210px] items-start gap-6 pt-7">
            <div className="hidden h-[143px] w-[146px] shrink-0 rounded-2xl bg-white/10 sm:block" />
            <div className="flex-1">
              <div className="flex flex-wrap justify-between gap-6">
                <div className="space-y-3">
                  <div className="h-7 w-56 rounded bg-white/10" />
                  <div className="h-4 w-36 rounded bg-white/5" />
                </div>
                <div className="flex gap-3">
                  <div className="h-9 w-24 rounded-full bg-white/10" />
                  <div className="h-9 w-24 rounded-full bg-white/5" />
                </div>
              </div>
              <div className="mt-4 h-4 max-w-[470px] rounded bg-white/5" />
              <div className="mt-3 h-4 w-52 rounded bg-white/5" />
            </div>
          </div>
          <div className="grid min-h-[73px] grid-cols-2 border-t border-white/10 py-3 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-r border-white/10 px-3 last:border-r-0 md:px-6"
              >
                <div className="h-8 w-8 rounded bg-white/5" />
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-white/5" />
                  <div className="h-4 w-20 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex h-[53px] items-center gap-10 border-b border-[#172b45]">
            <div className="h-4 w-12 rounded bg-white/10" />
            <div className="h-4 w-16 rounded bg-white/5" />
            <div className="h-4 w-14 rounded bg-white/5" />
          </div>
          <div className="mb-4 mt-5 flex justify-between gap-4">
            <div className="h-10 w-full max-w-sm rounded-lg bg-white/5" />
            <div className="h-10 w-40 rounded-lg bg-white/5" />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[265px_minmax(0,1fr)] xl:gap-7">
            <div className="hidden space-y-4 lg:block">
              <div className="h-40 rounded-xl bg-white/[0.03]" />
              <div className="h-52 rounded-xl bg-white/[0.03]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#030b19]"
                >
                  <div className="aspect-square bg-white/[0.05]" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-white/5" />
                    <div className="h-8 rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <span className="sr-only">Loading collection...</span>
    </main>
  );
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const [slug, setSlug] = useState("");
  const [paramsError, setParamsError] = useState(false);
  const { isPending } = useCollectionDetails(slug);

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

  if (paramsError) {
    return (
      <main>
        <p className="container bg-[#020812] py-4 text-center text-sm text-rose-400">
          Unable to load this collection route.
        </p>
      </main>
    );
  }

  if (!slug || isPending) {
    return <CollectionPageSkeleton />;
  }

  return (
    <main>
      <CollectionDetails slug={slug} />
      <CollectionItems slug={slug} />
    </main>
  );
}
