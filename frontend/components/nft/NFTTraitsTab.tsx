// import { traits } from "./nftDetailsData";

// export default function NFTTraitsTab() {
//   return (
//     <div className="p-5 md:p-7">
//       <h3 className="text-lg font-semibold">Traits & Rarity</h3>
//       <div className="mt-5 overflow-x-auto">
//         <table className="w-full min-w-[400px] text-left text-sm">
//           <thead className="text-xs text-blue-400">
//             <tr>
//               <th className="pb-4 font-medium">Trait</th>
//               <th className="pb-4 font-medium">Value</th>
//               <th className="pb-4 font-medium">Frequency</th>
//             </tr>
//           </thead>
//           <tbody>
//             {traits.map((trait) => (
//               <tr key={trait.name} className="border-t border-[#172c4c]">
//                 <td className="py-4">{trait.name}</td>
//                 <td className="py-4 text-blue-200">{trait.value}</td>
//                 <td className="py-4 text-cyan-300">{trait.rarity}</td>
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

type NFTTraitsTabProps = {
  nft: NFTDetailsData;
};

export default function NFTTraitsTab({ nft }: NFTTraitsTabProps) {
  const attributes = Array.isArray(nft.attributes)
    ? nft.attributes.filter(
        (attribute): attribute is Record<string, unknown> =>
          typeof attribute === "object" && attribute !== null,
      )
    : [];

  return (
    <div className="p-5 md:p-7">
      <h3 className="text-lg font-semibold">Traits & Rarity</h3>

      <div className="mt-5 overflow-x-auto">
        {attributes.length > 0 ? (
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead className="text-xs text-blue-400">
              <tr>
                <th className="pb-4 font-medium">Trait</th>
                <th className="pb-4 font-medium">Value</th>
                <th className="pb-4 font-medium">Frequency</th>
              </tr>
            </thead>

            <tbody>
              {attributes.map((attribute, index) => {
                const name = String(
                  attribute.trait_type ??
                    attribute.name ??
                    `Trait ${index + 1}`,
                );

                const value = String(attribute.value ?? "Unknown");

                return (
                  <tr
                    key={`${name}-${index}`}
                    className="border-t border-[#172c4c]"
                  >
                    <td className="py-4">{name}</td>
                    <td className="py-4 text-blue-200">{value}</td>
                    <td className="py-4 text-cyan-300">Not available</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="rounded-xl border border-[#172c4c] bg-[#07142a] p-5 text-sm text-blue-300">
            No traits or rarity data are available for this NFT yet.
          </p>
        )}
      </div>
    </div>
  );
}
