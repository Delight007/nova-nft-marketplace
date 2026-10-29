// import { traits } from "./nftDetailsData";

// export default function NFTPropertiesTab() {
//   return (
//     <div className="p-5 md:p-7">
//       <h3 className="text-lg font-semibold">NFT Properties</h3>
//       <p className="mt-2 text-sm text-blue-300">
//         Explore the traits that make this NFT unique.
//       </p>
//       <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
//         {traits.map((trait) => (
//           <div
//             key={trait.name}
//             className="rounded-xl border border-[#1b3152] bg-[#07142a] p-4"
//           >
//             <p className="text-xs text-cyan-300">{trait.name}</p>
//             <p className="mt-2 font-medium">{trait.value}</p>
//             <p className="mt-2 text-xs text-blue-400">
//               {trait.rarity} trait frequency
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import type { NFTDetailsData } from "@/services/nfts";

type NFTPropertiesTabProps = {
  nft: NFTDetailsData;
};

export default function NFTPropertiesTab({ nft }: NFTPropertiesTabProps) {
  const attributes = Array.isArray(nft.attributes)
    ? nft.attributes.filter(
        (attribute): attribute is Record<string, unknown> =>
          typeof attribute === "object" && attribute !== null,
      )
    : [];

  return (
    <div className="p-5 md:p-7">
      <h3 className="text-lg font-semibold">NFT Properties</h3>

      <p className="mt-2 text-sm text-blue-300">
        Explore the traits that make this NFT unique.
      </p>

      {attributes.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {attributes.map((attribute, index) => {
            const name = String(
              attribute.trait_type ?? attribute.name ?? `Trait ${index + 1}`,
            );

            const value = String(attribute.value ?? "Unknown");

            return (
              <div
                key={`${name}-${index}`}
                className="rounded-xl border border-[#1b3152] bg-[#07142a] p-4"
              >
                <p className="text-xs text-cyan-300">{name}</p>

                <p className="mt-2 break-words font-medium">{value}</p>

                <p className="mt-2 text-xs text-blue-400">
                  Trait frequency unavailable
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[#1b3152] bg-[#07142a] p-6 text-center">
          <p className="text-sm text-blue-300">
            No properties have been added to this NFT yet.
          </p>
        </div>
      )}
    </div>
  );
}
