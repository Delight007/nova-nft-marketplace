import type { ReactNode } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowRight, FiCheck, FiCopy, FiLink } from "react-icons/fi";
import { SiDiscord, SiSolana } from "react-icons/si";
import { images, nft } from "./nftDetailsData";

type NFTSidebarProps = {
  onAction: (message: string) => void;
  onShare: () => void;
};

export default function NFTSidebar({ onAction, onShare }: NFTSidebarProps) {
  return (
    <aside className="flex min-w-0 flex-col gap-3 lg:h-full lg:min-h-0 lg:overflow-y-auto">
      <div className="rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18] p-4">
        <h2 className="text-sm font-semibold">Creator</h2>
        <div className="mt-3 flex items-center gap-3">
          <img
            src={images[2]}
            alt={nft.creator}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-sm font-medium">
              {nft.creator}
              <span className="text-cyan-400">
                <FiCheck />
              </span>
            </p>
            <p className="mt-1 text-xs text-blue-400">{nft.handle}</p>
          </div>
        </div>
        <p className="ml-[52px] mt-1 text-xs text-blue-300">
          2.4K created <span className="px-1">•</span> 12.8K followers
        </p>
        <a
          href="/creators/neoncreators"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#30456a] py-2 text-xs text-blue-200 transition hover:border-cyan-400 hover:text-white"
        >
          View Creator <FiArrowRight />
        </a>
      </div>

      <div className="rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18] p-4">
        <h2 className="text-sm font-semibold">Marketplace Details</h2>
        <div className="mt-4 space-y-4">
          <DetailRow
            icon={<img src={images[2]} alt="" />}
            label="Collection"
            value={nft.collection}
          />
          <DetailRow
            icon={<span className="text-xl text-amber-400">♛</span>}
            label="Royalty"
            value={nft.royalty}
          />
          <DetailRow
            icon={<span className="text-lg">◎</span>}
            label="Marketplace Fee"
            value={nft.marketplaceFee}
          />
          <DetailRow
            icon={<SiSolana aria-hidden="true" className="text-[#14F195]" />}
            label="Payment Token"
            value="SOL"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18] p-4">
        <h2 className="text-sm font-semibold">Share</h2>
        <div className="mt-3 flex gap-2.5">
          <ShareButton label="Copy link" onClick={onShare}>
            <FiLink />
          </ShareButton>
          <ShareButton
            label="Share on X"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(nft.name)}&url=${encodeURIComponent(window.location.href)}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
              <FaXTwitter aria-hidden="true" />
          </ShareButton>
          <ShareButton
            label="Discord"
            onClick={() =>
              onAction("Share this NFT with your Discord community")
            }
          >
            <SiDiscord aria-hidden="true" />
          </ShareButton>
          <ShareButton label="Copy NFT URL" onClick={onShare}>
            <FiCopy />
          </ShareButton>
        </div>
      </div>

    </aside>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#1b3152] bg-[#0b1930]">
        {icon}
      </div>
      <span className="min-w-0 flex-1 text-xs text-blue-300">{label}</span>
      <span className="text-right text-xs font-medium">{value}</span>
    </div>
  );
}

function ShareButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-11 items-center justify-center rounded-xl border border-[#203555] bg-[#09172d] text-lg text-blue-100 transition hover:border-cyan-400 hover:bg-[#10223c]"
    >
      {children}
    </button>
  );
}
