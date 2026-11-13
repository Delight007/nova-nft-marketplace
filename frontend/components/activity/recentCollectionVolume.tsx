// "use client";

// import { useRecentCollectionVolume } from "@/hooks/use-recent-collection-volume";
// import Image from "next/image";
// import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

// export default function RecentCollectionVolume() {
//   const { data, isLoading, isError } = useRecentCollectionVolume();

//   return (
//     <section className="rounded-2xl border border-[#173d75] bg-[#030d24]/80 p-4">
//       <div className="mb-3 flex items-center justify-between">
//         <h2 className="text-sm font-semibold text-white">
//           Recent Collection Volume
//         </h2>

//         <span className="text-[9px] text-[#718bb9]">30 days</span>
//       </div>

//       {isLoading ? (
//         <div
//           role="status"
//           aria-label="Loading collection volumes"
//           className="animate-pulse"
//         >
//           {Array.from({ length: 5 }, (_, index) => (
//             <div
//               key={index}
//               aria-hidden="true"
//               className="flex items-center gap-2 border-t border-[#17335f] py-2.5"
//             >
//               <div className="h-3 w-4 rounded bg-[#132d5c]" />
//               <div className="h-8 w-8 shrink-0 rounded-lg bg-[#173665]" />
//               <div className="min-w-0 flex-1 space-y-1.5">
//                 <div className="h-3 w-2/3 rounded bg-[#173665]" />
//                 <div className="h-2 w-1/3 rounded bg-[#132d5c]" />
//               </div>
//               <div className="space-y-1.5">
//                 <div className="h-3 w-14 rounded bg-[#173665]" />
//                 <div className="ml-auto h-2 w-8 rounded bg-[#132d5c]" />
//               </div>
//             </div>
//           ))}
//           <span className="sr-only">Loading collection volumes...</span>
//         </div>
//       ) : isError ? (
//         <p className="py-6 text-center text-xs text-red-300">
//           Unable to load collection volumes.
//         </p>
//       ) : !data?.length ? (
//         <p className="py-6 text-center text-xs text-[#91b0e9]">
//           No collection sales in the last 30 days.
//         </p>
//       ) : (
//         <div>
//           {data.map((collection, index) => (
//             <div
//               key={collection.id}
//               className="flex items-center gap-2 border-t border-[#17335f] py-2.5"
//             >
//               <span className="w-4 text-center text-[10px] text-[#718ab8]">
//                 {index + 1}
//               </span>

//               <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#27447b] bg-[#0b1b3a]">
//                 {collection.image ? (
//                   <Image
//                     src={collection.image}
//                     alt={collection.name}
//                     fill
//                     sizes="32px"
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center text-xs text-[#718bb9]">
//                     {collection.name.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-1">
//                   <p className="truncate text-[10px] font-medium text-white">
//                     {collection.name}
//                   </p>

//                   {collection.verified && (
//                     <span className="text-[8px] text-[#4f91ff]">✓</span>
//                   )}
//                 </div>

//                 <p className="mt-0.5 text-[9px] text-[#718bb9]">
//                   {collection.salesCount}{" "}
//                   {collection.salesCount === 1 ? "sale" : "sales"}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <p className="text-[10px] font-semibold text-white">
//                   {collection.volume.toLocaleString(undefined, {
//                     maximumFractionDigits: 3,
//                   })}{" "}
//                   SOL
//                 </p>

//                 {collection.changePercent !== null && (
//                   <div
//                     className={`mt-0.5 flex items-center justify-end gap-0.5 text-[9px] font-medium ${
//                       collection.changePercent >= 0
//                         ? "text-[#00e4b2]"
//                         : "text-red-400"
//                     }`}
//                   >
//                     {collection.changePercent >= 0 ? (
//                       <FiArrowUpRight />
//                     ) : (
//                       <FiArrowDownRight />
//                     )}
//                     {Math.abs(collection.changePercent).toFixed(1)}%
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

"use client";

import { useRecentCollectionVolume } from "@/hooks/use-recent-collection-volume";
import Image from "next/image";

function formatVolume(volume: number) {
  return `${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(volume)} SOL`;
}

export default function RecentCollectionVolume() {
  const { data, isLoading, isError } = useRecentCollectionVolume();

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

      {isLoading ? (
        <p className="py-6 text-center text-xs text-[#91b0e9]">
          Loading collection volumes...
        </p>
      ) : isError ? (
        <p className="py-6 text-center text-xs text-red-300">
          Unable to load collection volumes.
        </p>
      ) : !data?.length ? (
        <p className="py-6 text-center text-xs text-[#91b0e9]">
          No collection sales in the last 30 days.
        </p>
      ) : (
        <div>
          {data.map((collection, index) => (
            <div
              key={collection.id}
              className="flex items-center gap-2 border-t border-[#17335f] py-2.5"
            >
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#24477e] bg-[#071a3b] text-[10px] text-[#8da8dc]">
                {index + 1}
              </span>

              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#27447b] bg-[#0b1b3a]">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#718bb9]">
                    {collection.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="truncate text-[10px] font-medium text-white">
                    {collection.name}
                  </p>

                  {collection.verified && (
                    <span className="shrink-0 text-[9px] text-[#4f91ff]">
                      ✓
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[9px] text-[#718bb9]">
                  {formatVolume(collection.volume)}
                </p>
              </div>

              {collection.changePercent !== null && (
                <div
                  className={`shrink-0 text-[10px] font-medium ${
                    collection.changePercent >= 0
                      ? "text-[#00e4b2]"
                      : "text-red-400"
                  }`}
                >
                  {collection.changePercent >= 0 ? "+" : ""}
                  {collection.changePercent.toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
