import {
  FiEye,
  FiHeart,
  FiMoreHorizontal,
  FiShare2,
  FiTag,
} from "react-icons/fi";
import { nft } from "./nftDetailsData";

type NFTPurchaseCardProps = {
  favorite: boolean;
  offerOpen: boolean;
  offerPrice: string;
  showMore: boolean;
  onFavorite: () => void;
  onOfferOpen: () => void;
  onOfferPriceChange: (price: string) => void;
  onShare: () => void;
  onShowMore: () => void;
  onCloseMore: () => void;
  onAction: (message: string) => void;
};

export default function NFTPurchaseCard({
  favorite,
  offerOpen,
  offerPrice,
  showMore,
  onFavorite,
  onOfferOpen,
  onOfferPriceChange,
  onShare,
  onShowMore,
  onCloseMore,
  onAction,
}: NFTPurchaseCardProps) {
  return (
    <div className="mt-5 rounded-2xl border border-[#152849] bg-gradient-to-br from-[#061126] to-[#030b18] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-blue-400">Current Price</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 text-lg font-black">
              ≋
            </span>
            <span className="text-2xl font-semibold">{nft.price} SOL</span>
          </div>
          <p className="ml-10 mt-1 text-xs text-slate-500">{nft.usdPrice}</p>
        </div>
        <div className="rounded-xl border border-[#172c4c] bg-[#071226] px-3 py-2.5 text-right">
          <p className="flex items-center justify-end gap-1 text-xs text-blue-400">
            <FiEye /> Last Sale
          </p>
          <p className="mt-1 text-sm font-medium">{nft.lastSale}</p>
          <p className="mt-1 text-[11px] text-blue-300">2 days ago</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onAction("Connect your Solana wallet to buy this NFT")}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-400 px-3 py-3.5 text-sm font-semibold transition hover:brightness-110"
        >
          <FiTag /> Buy Now
        </button>
        <button
          onClick={onOfferOpen}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/70 bg-[#050e20] px-3 py-3.5 text-sm font-semibold transition hover:bg-[#0b1c35]"
        >
          <FiTag /> Make Offer
        </button>
      </div>

      {offerOpen && (
        <div className="mt-4 rounded-xl border border-[#1b3152] bg-[#050e1c] p-3">
          <label
            htmlFor="offer-price"
            className="mb-2 block text-xs text-blue-300"
          >
            Your offer (SOL)
          </label>
          <div className="flex gap-2">
            <input
              id="offer-price"
              type="number"
              min="0"
              step="0.01"
              value={offerPrice}
              onChange={(event) => onOfferPriceChange(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#1b3152] bg-[#081329] px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
            <button
              onClick={() =>
                onAction(
                  `Connect your wallet to submit your ${offerPrice} SOL offer`,
                )
              }
              className="rounded-lg bg-violet-600 px-4 text-sm font-medium hover:bg-violet-500"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-[1fr_1fr_48px] gap-3">
        <button
          onClick={onFavorite}
          className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-3 text-xs transition ${
            favorite
              ? "border-pink-500/60 bg-pink-500/10 text-pink-300"
              : "border-[#1b3152] text-blue-200 hover:border-pink-500/60"
          }`}
        >
          <FiHeart className={favorite ? "fill-current" : ""} />
          {favorite ? "Favorited" : "Add to Favorites"}
        </button>
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#1b3152] px-2 py-3 text-xs text-blue-200 transition hover:border-cyan-400"
        >
          <FiShare2 /> Share
        </button>
        <div className="relative">
          <button
            onClick={onShowMore}
            aria-label="More NFT actions"
            className="flex h-full w-full items-center justify-center rounded-xl border border-[#1b3152] text-blue-200 hover:border-cyan-400"
          >
            <FiMoreHorizontal size={20} />
          </button>
          {showMore && (
            <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-[#203555] bg-[#09152a] p-1 shadow-xl">
              <button
                onClick={() => {
                  onCloseMore();
                  onAction("Report feature coming soon");
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
              >
                Report NFT
              </button>
              <button
                onClick={() => {
                  onCloseMore();
                  onAction("External links will be available soon");
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
              >
                View on explorer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
