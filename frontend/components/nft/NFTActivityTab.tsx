// import { FiTag } from "react-icons/fi";
// import { activity } from "./nftDetailsData";

// export default function NFTActivityTab() {
//   return (
//     <div className="p-5 md:p-7">
//       <h3 className="text-lg font-semibold">Item Activity</h3>
//       <p className="mt-2 text-sm text-blue-300">
//         Historical events for this NFT.
//       </p>
//       <div className="mt-5 overflow-x-auto">
//         <table className="w-full min-w-[520px] text-left text-sm">
//           <thead className="text-xs text-blue-400">
//             <tr>
//               <th className="pb-4 font-medium">Event</th>
//               <th className="pb-4 font-medium">Participant</th>
//               <th className="pb-4 font-medium">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activity.map((item) => (
//               <tr key={item.title} className="border-t border-[#172c4c]">
//                 <td className="py-4 font-medium">
//                   <span className="flex items-center gap-2">
//                     {item.type === "list" && (
//                       <FiTag
//                         aria-hidden="true"
//                         className="text-cyan-300"
//                       />
//                     )}
//                     {item.title}
//                   </span>
//                 </td>
//                 <td className="py-4 text-blue-200">{item.detail}</td>
//                 <td className="py-4 text-blue-400">{item.date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import type { NFTDetailsData } from "@/services/nfts";
import {
  FiAward,
  FiCheckCircle,
  FiMessageCircle,
  FiRefreshCw,
  FiTag,
  FiXCircle,
} from "react-icons/fi";
import {
  getActivityDescription,
  getNFTActivityEvents,
  type NFTActivityEvent,
} from "./nftActivity";

type NFTActivityTabProps = {
  nft: NFTDetailsData;
};

export default function NFTActivityTab({ nft }: NFTActivityTabProps) {
  const activityRows = getNFTActivityEvents(nft);

  return (
    <div className="p-5 md:p-7">
      <h3 className="text-lg font-semibold">Item Activity</h3>

      <p className="mt-2 text-sm text-blue-300">
        Historical events for this NFT.
      </p>

      <div className="mt-5 overflow-x-auto">
        {activityRows.length > 0 ? (
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-blue-400">
              <tr>
                <th className="pb-4 font-medium">Event</th>
                <th className="pb-4 font-medium">Participant</th>
                <th className="pb-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {activityRows.map((item) => (
                <tr key={item.id} className="border-t border-[#172c4c]">
                  <td className="py-4 font-medium">
                    <span className="flex items-center gap-2">
                        <ActivityIcon event={item} />
                      {item.title}
                    </span>
                  </td>

                  <td className="py-4 text-blue-200">
                    {getActivityDescription(item)}
                    {item.price !== null && (
                      <span className="ml-2 text-cyan-300">
                        {item.price} {item.currency}
                      </span>
                    )}
                  </td>

                  <td className="py-4 text-blue-400">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="rounded-xl border border-[#172c4c] bg-[#07142a] p-6 text-center">
            <p className="text-sm text-blue-300">
              No activity has been recorded for this NFT yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityIcon({ event }: { event: NFTActivityEvent }) {
  if (event.kind === "mint" && event.avatar) {
    return (
      <img
        src={event.avatar}
        alt=""
        className="h-5 w-5 rounded-full object-cover"
      />
    );
  }

  const className =
    event.kind === "sale"
      ? "text-emerald-300"
      : event.kind === "offer"
        ? "text-violet-300"
        : "text-cyan-300";

  if (event.kind === "mint") {
    return <FiAward aria-hidden="true" className={className} />;
  }
  if (event.kind === "list") {
    return <FiTag aria-hidden="true" className={className} />;
  }
  if (event.kind === "offer") {
    return <FiMessageCircle aria-hidden="true" className={className} />;
  }
  if (event.kind === "sale") {
    return <FiCheckCircle aria-hidden="true" className={className} />;
  }
  if (event.kind === "transfer") {
    return <FiRefreshCw aria-hidden="true" className={className} />;
  }
  if (event.kind === "cancel") {
    return <FiXCircle aria-hidden="true" className={className} />;
  }
  return <FiRefreshCw aria-hidden="true" className={className} />;
}
