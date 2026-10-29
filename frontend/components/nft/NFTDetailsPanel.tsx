// import { useState } from "react";
// import { FiArrowUpRight } from "react-icons/fi";
// import NFTActivityTab from "./NFTActivityTab";
// import NFTOverviewTab from "./NFTOverviewTab";
// import NFTPropertiesTab from "./NFTPropertiesTab";
// import NFTTraitsTab from "./NFTTraitsTab";
// import { tabs } from "./nftDetailsData";
// import type { NFTDetailsTab } from "./nftDetailsData";

// type NFTDetailsPanelProps = {
//   onAction: (message: string) => void;
// };

// export default function NFTDetailsPanel({ onAction }: NFTDetailsPanelProps) {
//   const [activeTab, setActiveTab] = useState<NFTDetailsTab>("Details");

//   return (
//     <section className="mt-8 overflow-hidden rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18]">
//       <div className="flex items-center justify-between overflow-x-auto border-b border-[#142541] px-4 md:px-5">
//         <div className="flex gap-5 md:gap-8">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`relative whitespace-nowrap py-5 text-sm transition ${
//                 activeTab === tab
//                   ? "font-semibold text-white"
//                   : "text-blue-300 hover:text-white"
//               }`}
//             >
//               {tab}
//               {activeTab === tab && (
//                 <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400" />
//               )}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => onAction("More details coming soon")}
//           aria-label="More details"
//           className="ml-4 shrink-0 text-blue-300 hover:text-cyan-300"
//         >
//           <FiArrowUpRight />
//         </button>
//       </div>

//       {activeTab === "Details" && (
//         <NFTOverviewTab
//           onAction={onAction}
//           onShowProperties={() => setActiveTab("Properties")}
//           onShowActivity={() => setActiveTab("Activity")}
//         />
//       )}
//       {activeTab === "Properties" && <NFTPropertiesTab />}
//       {activeTab === "Traits" && <NFTTraitsTab />}
//       {activeTab === "Activity" && <NFTActivityTab />}
//     </section>
//   );
// }

"use client";

import type { NFTDetailsData } from "@/services/nfts";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import NFTActivityTab from "./NFTActivityTab";
import NFTOverviewTab from "./NFTOverviewTab";
import NFTPropertiesTab from "./NFTPropertiesTab";
import NFTTraitsTab from "./NFTTraitsTab";
import type { NFTDetailsTab } from "./nftDetailsData";
import { tabs } from "./nftDetailsData";

type NFTDetailsPanelProps = {
  nft?: NFTDetailsData;
  isLoading?: boolean;
  onAction: (message: string) => void;
};

export default function NFTDetailsPanel({
  nft,
  isLoading = false,
  onAction,
}: NFTDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<NFTDetailsTab>("Details");

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18]">
      <div className="flex items-center justify-between overflow-x-auto border-b border-[#142541] px-4 md:px-5">
        <div className="flex gap-5 md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap py-5 text-sm transition ${
                activeTab === tab
                  ? "font-semibold text-white"
                  : "text-blue-300 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => onAction("More details coming soon")}
          aria-label="More details"
          className="ml-4 shrink-0 text-blue-300 hover:text-cyan-300"
        >
          <FiArrowUpRight />
        </button>
      </div>

      {isLoading || !nft ? (
        <div
          aria-label="Loading NFT tab content"
          className="min-h-64 animate-pulse space-y-4 p-5"
        >
          <div className="h-4 w-40 rounded bg-[#152849]" />
          <div className="h-3 w-full max-w-2xl rounded bg-[#152849]" />
          <div className="h-3 w-4/5 rounded bg-[#152849]" />
          <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl border border-[#152849] bg-[#071124]"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {activeTab === "Details" && (
            <NFTOverviewTab
              nft={nft}
              onAction={onAction}
              onShowProperties={() => setActiveTab("Properties")}
              onShowActivity={() => setActiveTab("Activity")}
            />
          )}

          {activeTab === "Properties" && <NFTPropertiesTab nft={nft} />}

          {activeTab === "Traits" && <NFTTraitsTab nft={nft} />}

          {activeTab === "Activity" && <NFTActivityTab nft={nft} />}
        </>
      )}
    </section>
  );
}
