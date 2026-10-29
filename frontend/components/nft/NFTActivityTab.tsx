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
import { FiRepeat, FiShoppingBag, FiTag } from "react-icons/fi";

type NFTActivityTabProps = {
  nft: NFTDetailsData;
};

type ActivityRow = {
  id: string;
  title: string;
  type: string;
  participant: string;
  date: string;
};

export default function NFTActivityTab({ nft }: NFTActivityTabProps) {
  const activityRows: ActivityRow[] = [
    ...nft.activities.map((item) => ({
      id: `activity-${item.id}`,
      title: item.type,
      type: item.type.toLowerCase(),
      participant:
        item.user?.username || item.user?.wallet || "Unknown participant",
      date: item.createdAt,
    })),
    ...nft.sales.map((sale) => ({
      id: `sale-${sale.id}`,
      title: "Sale",
      type: "sale",
      participant:
        sale.buyer?.username ||
        sale.buyer?.wallet ||
        sale.seller?.username ||
        sale.seller?.wallet ||
        "Unknown participant",
      date: sale.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatParticipant = (participant: string) => {
    if (participant.length > 24 && participant.startsWith("0")) {
      return `${participant.slice(0, 6)}...${participant.slice(-4)}`;
    }

    return participant;
  };

  const getActivityIcon = (type: string) => {
    if (type.includes("list")) {
      return <FiTag aria-hidden="true" className="text-cyan-300" />;
    }

    if (type.includes("sale")) {
      return <FiShoppingBag aria-hidden="true" className="text-emerald-300" />;
    }

    return <FiRepeat aria-hidden="true" className="text-violet-300" />;
  };

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
                      {getActivityIcon(item.type)}
                      {item.title}
                    </span>
                  </td>

                  <td className="py-4 text-blue-200">
                    {formatParticipant(item.participant)}
                  </td>

                  <td className="py-4 text-blue-400">
                    {formatDate(item.date)}
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
