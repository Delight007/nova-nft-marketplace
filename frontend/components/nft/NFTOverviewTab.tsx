// import { FaWallet } from "react-icons/fa6";
// import { FiArrowRight, FiCheck, FiExternalLink, FiTag } from "react-icons/fi";
// import { activity, images, nft, traits } from "./nftDetailsData";

// type NFTOverviewTabProps = {
//   onAction: (message: string) => void;
//   onShowProperties: () => void;
//   onShowActivity: () => void;
// };

// export default function NFTOverviewTab({
//   onAction,
//   onShowProperties,
//   onShowActivity,
// }: NFTOverviewTabProps) {
//   return (
//     <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_1.2fr_0.8fr_0.85fr]">
//       <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
//         <h3 className="text-sm font-semibold">Description</h3>
//         <p className="mt-3 text-xs leading-6 text-blue-200">
//           {nft.description}
//         </p>
//         <div className="mt-5 rounded-xl border border-[#172c4c] bg-[#040d1e] p-3.5">
//           <div className="flex items-center gap-3">
//             <img
//               src={images[0]}
//               alt="Neon Realms collection"
//               className="h-20 w-24 rounded-lg object-cover"
//             />
//             <div>
//               <h4 className="text-sm font-semibold">{nft.collection}</h4>
//               <p className="mt-2 text-[11px] leading-5 text-blue-300">
//                 A collection of 10,000 unique digital art pieces exploring the
//                 intersection of humanity and technology.
//               </p>
//             </div>
//           </div>
//           <a
//             href="/collections/neon-realms"
//             className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#30456a] px-4 py-2 text-xs font-medium hover:border-cyan-400"
//           >
//             View Collection <FiArrowRight />
//           </a>
//         </div>
//       </section>

//       <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
//         <div className="flex items-center justify-between gap-2">
//           <h3 className="text-sm font-semibold">Properties & Traits</h3>
//           <button
//             onClick={onShowProperties}
//             className="shrink-0 text-[10px] text-blue-400 hover:text-cyan-300"
//           >
//             View all →
//           </button>
//         </div>
//         <p className="mt-3 text-xs text-blue-300">Traits</p>
//         <div className="mt-2 grid grid-cols-2 gap-2">
//           {traits.map((trait, index) => (
//             <div
//               key={trait.name}
//               className="min-w-0 rounded-xl border border-[#172d4d] bg-[#07142a] p-2.5"
//             >
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/20 text-xs font-bold text-cyan-200">
//                   {["✦", "◉", "✧", "◈", "♛", "◇"][index]}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="truncate text-[10px] text-blue-400">
//                     {trait.name}
//                   </p>
//                   <p className="truncate text-[11px] font-medium">
//                     {trait.value}
//                   </p>
//                 </div>
//               </div>
//               <p className="mt-2 text-[9px] text-slate-500">
//                 {trait.rarity} have this trait
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
//         <h3 className="text-sm font-semibold">Contract Information</h3>
//         <div className="mt-5 space-y-5 text-xs">
//           <ContractField
//             label="Mint Address"
//             value="6Qf3...Zk9p"
//             onClick={() => onAction("Connect an explorer URL to view the mint")}
//           />
//           <ContractField
//             label="Token Standard"
//             value="Metaplex (Token Metadata)"
//           />
//           <ContractField label="Token ID" value={nft.id} />
//           <ContractField
//             label="Metadata URI"
//             value="ipfs://QmX7...e9a2"
//             onClick={() => onAction("Add your real metadata URI")}
//           />
//           <ContractField
//             label="Creator Address"
//             value="9f2B...c4e7"
//             onClick={() => onAction("Add the real creator address")}
//           />
//         </div>
//       </section>

//       <section className="min-w-0 p-5">
//         <div className="flex items-center justify-between gap-2">
//           <h3 className="text-sm font-semibold">Activity</h3>
//           <button
//             onClick={onShowActivity}
//             className="shrink-0 text-[10px] text-blue-400 hover:text-cyan-300"
//           >
//             View all →
//           </button>
//         </div>
//         <div className="mt-5 space-y-5">
//           {activity.map((item, index) => (
//             <div key={item.title} className="flex gap-3">
//               <div className="relative flex flex-col items-center">
//                 <div
//                   className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
//                     item.type === "sold"
//                       ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
//                       : "border-[#233d65] bg-[#0c2142] text-cyan-300"
//                   }`}
//                 >
//                   {item.type === "mint" && <FiTag size={14} />}
//                   {item.type === "list" && <FiTag size={14} />}
//                   {item.type === "offer" && <FaWallet size={14} />}
//                   {item.type === "sold" && <FiCheck size={16} />}
//                 </div>
//                 {index !== activity.length - 1 && (
//                   <div className="absolute top-8 h-[48px] w-px bg-[#233d65]" />
//                 )}
//               </div>
//               <div className="min-w-0 pb-1">
//                 <p className="text-xs font-medium">{item.title}</p>
//                 <p className="mt-1 text-[10px] text-blue-300">{item.detail}</p>
//                 <p className="mt-1 text-[10px] text-blue-400">{item.date}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// function ContractField({
//   label,
//   value,
//   onClick,
// }: {
//   label: string;
//   value: string;
//   onClick?: () => void;
// }) {
//   return (
//     <div>
//       <p className="text-[11px] text-blue-400">{label}</p>
//       <div className="mt-1 flex items-center gap-1.5">
//         <span className="break-all text-[11px] text-blue-100">{value}</span>
//         {onClick && (
//           <button
//             onClick={onClick}
//             aria-label={`View ${label}`}
//             className="shrink-0 text-blue-300 hover:text-cyan-300"
//           >
//             <FiExternalLink size={12} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import type { NFTDetailsData } from "@/services/nfts";
import { FaWallet } from "react-icons/fa6";
import { FiArrowRight, FiCheck, FiExternalLink, FiTag } from "react-icons/fi";

type NFTOverviewTabProps = {
  nft: NFTDetailsData;
  onAction: (message: string) => void;
  onShowProperties: () => void;
  onShowActivity: () => void;
};

export default function NFTOverviewTab({
  nft,
  onAction,
  onShowProperties,
  onShowActivity,
}: NFTOverviewTabProps) {
  const collection = nft.collection;

  const attributes = Array.isArray(nft.attributes)
    ? nft.attributes.filter(
        (attribute): attribute is Record<string, unknown> =>
          typeof attribute === "object" && attribute !== null,
      )
    : [];

  const recentActivity = [
    ...nft.activities.map((item) => ({
      id: item.id,
      title: item.type,
      detail: item.user?.username || item.user?.wallet || "Unknown wallet",
      date: item.createdAt,
      type: item.type.toLowerCase(),
      price: item.price,
      currency: item.currency,
    })),
    ...nft.sales.map((sale) => ({
      id: sale.id,
      title: "Sale",
      detail: `Buyer: ${sale.buyer.username || sale.buyer.wallet}`,
      date: sale.createdAt,
      type: "sale",
      price: sale.price,
      currency: sale.currency,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const shortenAddress = (address: string) =>
    address.length > 14
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const formatActivityTitle = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_1.2fr_0.8fr_0.85fr]">
      <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-semibold">Description</h3>

        <p className="mt-3 text-xs leading-6 text-blue-200">
          {nft.description || "No description has been added for this NFT yet."}
        </p>

        <div className="mt-5 rounded-xl border border-[#172c4c] bg-[#040d1e] p-3.5">
          <div className="flex items-center gap-3">
            {collection?.image ? (
              <img
                src={collection.image}
                alt={collection.name}
                className="h-20 w-24 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-[#0b1930] text-2xl text-violet-300">
                {collection?.name?.charAt(0) ?? "N"}
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-sm font-semibold">
                {collection?.name ?? "Uncollected NFT"}
              </h4>
              <p className="mt-2 text-[11px] leading-5 text-blue-300">
                {collection
                  ? `Explore NFTs in the ${collection.name} collection.`
                  : "This NFT is not assigned to a collection."}
              </p>
            </div>
          </div>

          {collection && (
            <a
              href={`/collections/${collection.slug}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#30456a] px-4 py-2 text-xs font-medium hover:border-cyan-400"
            >
              View Collection <FiArrowRight />
            </a>
          )}
        </div>
      </section>

      <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Properties & Traits</h3>
          <button
            onClick={onShowProperties}
            className="shrink-0 text-[10px] text-blue-400 hover:text-cyan-300"
          >
            View all →
          </button>
        </div>

        <p className="mt-3 text-xs text-blue-300">Traits</p>

        {attributes.length > 0 ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {attributes.slice(0, 6).map((attribute, index) => {
              const name = String(
                attribute.trait_type ?? attribute.name ?? `Trait ${index + 1}`,
              );
              const value = String(attribute.value ?? "Unknown");

              return (
                <div
                  key={`${name}-${index}`}
                  className="min-w-0 rounded-xl border border-[#172d4d] bg-[#07142a] p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/20 text-xs font-bold text-cyan-200">
                      {["✦", "◉", "✧", "◈", "♛", "◇"][index % 6]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] text-blue-400">
                        {name}
                      </p>
                      <p className="truncate text-[11px] font-medium">
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-blue-400">
            No properties or traits are available for this NFT.
          </p>
        )}
      </section>

      <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-semibold">Contract Information</h3>

        <div className="mt-5 space-y-5 text-xs">
          <ContractField
            label="Mint Address"
            value={nft.mintAddress}
            onClick={() =>
              void navigator.clipboard
                .writeText(nft.mintAddress)
                .then(() => onAction("Mint address copied"))
                .catch(() => onAction("Unable to copy mint address"))
            }
          />

          <ContractField label="Token Standard" value="Solana NFT" />

          <ContractField label="Database ID" value={nft.id} />

          <ContractField
            label="Metadata URI"
            value={nft.metadataUri || "Not available"}
            onClick={
              nft.metadataUri
                ? () =>
                    window.open(
                      nft.metadataUri!,
                      "_blank",
                      "noopener,noreferrer",
                    )
                : undefined
            }
          />

          <ContractField
            label="Creator Address"
            value={nft.creator.wallet}
            onClick={() =>
              void navigator.clipboard
                .writeText(nft.creator.wallet)
                .then(() => onAction("Creator address copied"))
                .catch(() => onAction("Unable to copy creator address"))
            }
          />
        </div>
      </section>

      <section className="min-w-0 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Activity</h3>
          <button
            onClick={onShowActivity}
            className="shrink-0 text-[10px] text-blue-400 hover:text-cyan-300"
          >
            View all →
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      item.type.includes("sale") || item.type.includes("sold")
                        ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                        : "border-[#233d65] bg-[#0c2142] text-cyan-300"
                    }`}
                  >
                    {item.type.includes("sale") ||
                    item.type.includes("sold") ? (
                      <FiCheck size={16} />
                    ) : item.type.includes("offer") ? (
                      <FaWallet size={14} />
                    ) : (
                      <FiTag size={14} />
                    )}
                  </div>

                  {index !== recentActivity.length - 1 && (
                    <div className="absolute top-8 h-[48px] w-px bg-[#233d65]" />
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <p className="text-xs font-medium">
                    {formatActivityTitle(item.title)}
                  </p>
                  <p className="mt-1 break-words text-[10px] text-blue-300">
                    {shortenAddress(item.detail)}
                  </p>
                  {item.price !== null && item.price !== undefined && (
                    <p className="mt-1 text-[10px] text-cyan-300">
                      {item.price} {item.currency ?? ""}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-blue-400">
                    {formatDate(item.date)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs leading-5 text-blue-400">
              No activity has been recorded for this NFT yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ContractField({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <div>
      <p className="text-[11px] text-blue-400">{label}</p>
      <div className="mt-1 flex items-start gap-1.5">
        <span className="min-w-0 break-all text-[11px] text-blue-100">
          {value}
        </span>
        {onClick && (
          <button
            onClick={onClick}
            aria-label={`Open or copy ${label}`}
            className="shrink-0 text-blue-300 hover:text-cyan-300"
          >
            <FiExternalLink size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
