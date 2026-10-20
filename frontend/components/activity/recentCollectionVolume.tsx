import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

import { collectionVolumeData } from "./activityData";

export default function RecentCollectionVolume() {
  return (
    <section className="rounded-2xl border border-[#173d75] bg-[#030d24]/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          Recent Collection Volume
        </h2>

        <button className="text-[10px] text-[#8da8dc] hover:text-white">
          View all
        </button>
      </div>

      <div>
        {collectionVolumeData.map((collection) => (
          <div
            key={collection.rank}
            className="flex items-center gap-2 border-t border-[#17335f] py-2.5"
          >
            <span className="w-4 text-center text-[10px] text-[#718ab8]">
              {collection.rank}
            </span>

            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#27447b]">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-[10px] font-medium text-white">
                  {collection.name}
                </p>

                <span className="text-[8px] text-[#4f91ff]">✓</span>
              </div>

              <p className="mt-0.5 text-[9px] text-[#718bb9]">
                {collection.volume}K SOL
              </p>
            </div>

            <div className="flex items-center gap-0.5 text-[10px] font-medium text-[#00e4b2]">
              +{collection.change}%
              <FiArrowUpRight className="text-[9px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
