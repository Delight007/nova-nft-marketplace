"use client";

import { FaCheck, FaImage, FaInfoCircle } from "react-icons/fa";
import { Trait } from "./types";

interface NftPreviewProps {
  image: string | null;
  name: string;
  collection: string;
  royalty: string;
  traits: Trait[];
  onMint: () => void;
}

export default function NftPreview({
  image,
  name,
  collection,
  royalty,
  traits,
  onMint,
}: NftPreviewProps) {
  const displayName = name || "Cyber Soul #001";

  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126]/80 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">3. NFT Preview</h2>

        <p className="mt-2 text-sm text-slate-400">
          This is how your NFT will appear in the marketplace.
        </p>
      </div>

      {/* NFT CARD */}
      <div className="overflow-hidden rounded-2xl border border-blue-500/30 bg-[#06152d]">
        {/* IMAGE */}
        <div className="relative aspect-[1.25/1] overflow-hidden bg-gradient-to-br from-purple-900/50 via-[#081b3b] to-cyan-900/30">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-600">
              <FaImage className="text-5xl" />

              <p className="mt-3 text-sm">Upload artwork to preview your NFT</p>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {displayName}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-[9px] font-bold">
                  N
                </div>

                <span className="text-sm text-slate-300">{collection}</span>

                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] text-black">
                  <FaCheck />
                </span>
              </div>
            </div>

            <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[10px] text-cyan-300">
              Created by @levi
            </span>
          </div>

          <div className="my-5 h-px bg-blue-500/20" />

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-semibold text-white">
                {royalty || "5"}%
              </p>

              <p className="mt-1 text-xs text-slate-500">Royalty</p>
            </div>

            <div>
              <p className="text-xl font-semibold text-white">~0.002 SOL</p>

              <p className="mt-1 text-xs text-slate-500">Est. Network Fee</p>
            </div>
          </div>

          {/* ATTRIBUTES */}
          {traits.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-white">Attributes</p>

              <div className="flex flex-wrap gap-2">
                {traits
                  .filter((trait) => trait.trait_type && trait.value)
                  .map((trait, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200"
                    >
                      {trait.trait_type}: {trait.value}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MINT */}
      <button
        type="button"
        onClick={onMint}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.15)] transition hover:scale-[1.01] hover:opacity-95"
      >
        ✦ Mint NFT
      </button>

      {/* DRAFT */}
      <button
        type="button"
        className="mt-3 w-full rounded-xl border border-blue-500/30 bg-transparent py-3 text-sm font-medium text-slate-300 transition hover:border-blue-400 hover:text-white"
      >
        Save as Draft
      </button>

      {/* INFO */}
      <div className="mt-5 flex gap-3 text-xs leading-5 text-slate-500">
        <FaInfoCircle className="mt-0.5 shrink-0 text-slate-400" />

        <p>
          You'll be prompted to connect your wallet and confirm the transaction
          on Solana.
        </p>
      </div>
    </section>
  );
}
