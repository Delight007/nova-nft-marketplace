import MarketplaceStats from "@/components/marketplaceStats";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

const trendingCollections = [
  {
    id: 1,
    name: "Neon Realms",
    items: "10K items",
    growth: "+24.5%",
    floor: "3.2 SOL",
    image: "/images/n.png",
  },
  {
    id: 2,
    name: "Ape Society",
    items: "8.7K items",
    growth: "+18.2%",
    floor: "2.8 SOL",
    image: "/images/n2.png",
  },
  {
    id: 3,
    name: "Sky Islands",
    items: "5.4K items",
    growth: "+12.6%",
    floor: "1.9 SOL",
    image: "/images/n3.jpg",
  },
  {
    id: 4,
    name: "The Forgotten",
    items: "7.1K items",
    growth: "+9.3%",
    floor: "1.4 SOL",
    image: "/images/n.png",
  },
];

export default function TrendingCollections() {
  return (
    <section className="border-b border-white/10 ">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 px-6 py-5 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] lg:px-10">
        <div className="min-w-0 rounded-xl bg-[#050e1d] p-3">
          {/* Section heading */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Trending Collections
              </h2>

              <p className="text-xs text-slate-400">
                Explore the most popular collections on the marketplace.
              </p>
            </div>

            <Link
              href="/collections"
              className="flex shrink-0 items-center gap-2 text-xs text-blue-400 transition hover:text-cyan-300"
            >
              View all <FiArrowRight />
            </Link>
          </div>

          {/* Collection cards */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {trendingCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group flex min-w-0 items-center gap-2 rounded-lg border border-blue-900/70 bg-[#061021] p-2 transition duration-300 hover:border-cyan-500/60 hover:bg-[#09172b]"
              >
                {/* Collection artwork */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="40px"
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Collection details */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-semibold text-white transition group-hover:text-cyan-300">
                    {collection.name}
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {collection.items}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <FiTrendingUp className="text-[11px]" />
                    {collection.growth}
                  </p>
                </div>

                {/* Floor price */}
                <div className="shrink-0 self-end pb-0.5 text-right">
                  <p className="text-[10px] font-medium text-cyan-300">
                    {collection.floor}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <MarketplaceStats />
      </div>
    </section>
  );
}
