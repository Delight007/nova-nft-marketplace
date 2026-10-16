import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiEye,
  FiHeart,
} from "react-icons/fi";

export type NFT = {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  currency: string;
  views: string;
  listed: string;
  verified: boolean;
  likes: number;
};

type NFTCardProps = {
  nft: NFT;
};

export default function NFTCard({ nft }: NFTCardProps) {
  const solPrice = nft.price.toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });

  return (
    <article className="group w-full overflow-hidden rounded-[14px] border border-[#172640] bg-[#050b17] p-[3px] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_12px_35px_rgba(139,92,246,0.12)]">
      {/* NFT Artwork */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[11px] bg-[#0b1326]">
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Subtle artwork overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050b17]/20 via-transparent to-black/10" />

        {/* Favorite button */}
        <button
          type="button"
          aria-label={`Like ${nft.name}`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#071020]/75 text-white backdrop-blur-md transition hover:border-purple-400 hover:bg-purple-600"
        >
          <FiHeart className="h-[17px] w-[17px]" />
        </button>
      </div>

      {/* NFT Information */}
      <div className="px-[10px] pb-[9px] pt-[9px]">
        {/* Collection and Buy Now */}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {/* Collection avatar */}
            <div className="h-[25px] w-[25px] shrink-0 overflow-hidden rounded-full border border-purple-400/40 bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-[1px]">
              <img
                src={nft.image}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <span className="truncate text-[11px] font-medium tracking-wide text-slate-300">
              {nft.collection}
            </span>

            {nft.verified && (
              <span
                className="flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
                aria-label="Verified collection"
                title="Verified collection"
              >
                <FiCheck className="h-[9px] w-[9px] stroke-[3]" />
              </span>
            )}
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center justify-center rounded-full border border-purple-500/20 bg-[#241344] px-[11px] py-[5px] text-[10px] font-medium text-purple-300 transition hover:border-purple-400/60 hover:bg-purple-600 hover:text-white"
          >
            Buy Now
            <FiArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        </div>

        {/* NFT Name */}
        <h3 className="mt-[2px] truncate text-[13px] font-semibold leading-5 tracking-tight text-white">
          {nft.name}
        </h3>

        {/* Price and USD estimate */}
        <div className="mt-[9px] flex items-center gap-2">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#10243a] text-cyan-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-[13px] w-[13px]"
              aria-label="Solana"
              role="img"
            >
              <path d="M6.5 5.5h12l-3 3h-12l3-3Z" fill="currentColor" />
              <path
                d="M5.5 10.5h12l-3 3h-12l3-3Z"
                fill="#A78BFA"
                transform="translate(1 0)"
              />
              <path d="M6.5 15.5h12l-3 3h-12l3-3Z" fill="currentColor" />
            </svg>
          </span>

          <span className="text-[12px] font-semibold text-slate-100">
            {solPrice} {nft.currency}
          </span>

          <span className="text-[11px] text-slate-600">≈</span>

          <span className="text-[11px] text-slate-500">
            {nft.currency.toUpperCase() === "SOL"
              ? `≈ $${(nft.price * 124).toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}`
              : ""}
          </span>
        </div>

        {/* Footer metadata */}
        <div className="mt-[12px] flex items-center justify-between border-t border-white/[0.045] pt-[9px]">
          <span className="flex items-center gap-[5px] text-[10px] text-slate-500">
            <FiEye className="h-[12px] w-[12px] text-slate-500" />
            {nft.views} views
          </span>

          <span className="flex items-center gap-[5px] text-[10px] text-slate-500">
            <FiClock className="h-[11px] w-[11px]" />
            {nft.listed}
          </span>
        </div>
      </div>
    </article>
  );
}
