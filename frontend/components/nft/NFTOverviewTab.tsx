import { FaWallet } from "react-icons/fa6";
import { FiArrowRight, FiCheck, FiExternalLink, FiTag } from "react-icons/fi";
import { activity, images, nft, traits } from "./nftDetailsData";

type NFTOverviewTabProps = {
  onAction: (message: string) => void;
  onShowProperties: () => void;
  onShowActivity: () => void;
};

export default function NFTOverviewTab({
  onAction,
  onShowProperties,
  onShowActivity,
}: NFTOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_1.2fr_0.8fr_0.85fr]">
      <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-semibold">Description</h3>
        <p className="mt-3 text-xs leading-6 text-blue-200">
          {nft.description}
        </p>
        <div className="mt-5 rounded-xl border border-[#172c4c] bg-[#040d1e] p-3.5">
          <div className="flex items-center gap-3">
            <img
              src={images[0]}
              alt="Neon Realms collection"
              className="h-20 w-24 rounded-lg object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold">{nft.collection}</h4>
              <p className="mt-2 text-[11px] leading-5 text-blue-300">
                A collection of 10,000 unique digital art pieces exploring the
                intersection of humanity and technology.
              </p>
            </div>
          </div>
          <a
            href="/collections/neon-realms"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#30456a] px-4 py-2 text-xs font-medium hover:border-cyan-400"
          >
            View Collection <FiArrowRight />
          </a>
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
        <div className="mt-2 grid grid-cols-2 gap-2">
          {traits.map((trait, index) => (
            <div
              key={trait.name}
              className="min-w-0 rounded-xl border border-[#172d4d] bg-[#07142a] p-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/20 text-xs font-bold text-cyan-200">
                  {["✦", "◉", "✧", "◈", "♛", "◇"][index]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] text-blue-400">
                    {trait.name}
                  </p>
                  <p className="truncate text-[11px] font-medium">
                    {trait.value}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[9px] text-slate-500">
                {trait.rarity} have this trait
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 border-b border-[#142541] p-5 lg:border-b-0 lg:border-r">
        <h3 className="text-sm font-semibold">Contract Information</h3>
        <div className="mt-5 space-y-5 text-xs">
          <ContractField
            label="Mint Address"
            value="6Qf3...Zk9p"
            onClick={() => onAction("Connect an explorer URL to view the mint")}
          />
          <ContractField
            label="Token Standard"
            value="Metaplex (Token Metadata)"
          />
          <ContractField label="Token ID" value={nft.id} />
          <ContractField
            label="Metadata URI"
            value="ipfs://QmX7...e9a2"
            onClick={() => onAction("Add your real metadata URI")}
          />
          <ContractField
            label="Creator Address"
            value="9f2B...c4e7"
            onClick={() => onAction("Add the real creator address")}
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
          {activity.map((item, index) => (
            <div key={item.title} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    item.type === "sold"
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                      : "border-[#233d65] bg-[#0c2142] text-cyan-300"
                  }`}
                >
                  {item.type === "mint" && <FiTag size={14} />}
                  {item.type === "list" && <FiTag size={14} />}
                  {item.type === "offer" && <FaWallet size={14} />}
                  {item.type === "sold" && <FiCheck size={16} />}
                </div>
                {index !== activity.length - 1 && (
                  <div className="absolute top-8 h-[48px] w-px bg-[#233d65]" />
                )}
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-xs font-medium">{item.title}</p>
                <p className="mt-1 text-[10px] text-blue-300">{item.detail}</p>
                <p className="mt-1 text-[10px] text-blue-400">{item.date}</p>
              </div>
            </div>
          ))}
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
      <div className="mt-1 flex items-center gap-1.5">
        <span className="break-all text-[11px] text-blue-100">{value}</span>
        {onClick && (
          <button
            onClick={onClick}
            aria-label={`View ${label}`}
            className="shrink-0 text-blue-300 hover:text-cyan-300"
          >
            <FiExternalLink size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
