"use client";

import { FaChevronDown, FaLink, FaPlus, FaTimes } from "react-icons/fa";

import type { Trait } from "./types";

interface NftDetailsProps {
  name: string;
  description: string;
  collection: string;
  royalty: string;
  externalUrl: string;
  traits: Trait[];

  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCollectionChange: (value: string) => void;
  onRoyaltyChange: (value: string) => void;
  onExternalUrlChange: (value: string) => void;

  onAddTrait: () => void;

  onUpdateTrait: (
    index: number,
    field: "trait_type" | "value",
    value: string,
  ) => void;

  onRemoveTrait: (index: number) => void;
}

export default function CreateNftDetails({
  name,
  description,
  collection,
  royalty,
  externalUrl,
  traits,
  onNameChange,
  onDescriptionChange,
  onCollectionChange,
  onRoyaltyChange,
  onExternalUrlChange,
  onAddTrait,
  onUpdateTrait,
  onRemoveTrait,
}: NftDetailsProps) {
  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126]/80 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          <span className="mr-2">2.</span>
          NFT Details
        </h2>
      </div>

      {/* NAME */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-white">
            Name <span className="text-red-400">*</span>
          </label>

          <span className="text-xs text-slate-500">{name.length}/50</span>
        </div>

        <input
          value={name}
          maxLength={50}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. Cyber Soul #001"
          className="w-full rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-white">
            Description <span className="text-red-400">*</span>
          </label>

          <span className="text-xs text-slate-500">
            {description.length}/500
          </span>
        </div>

        <textarea
          value={description}
          maxLength={500}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Tell the story behind your NFT..."
          rows={4}
          className="w-full resize-none rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
        />
      </div>

      {/* COLLECTION */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium">
          Collection <span className="text-red-400">*</span>
        </label>

        <div className="relative">
          <select
            value={collection}
            onChange={(event) => onCollectionChange(event.target.value)}
            className="w-full appearance-none rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="Neon Realms">Neon Realms</option>
            <option value="Cyber Souls">Cyber Souls</option>
            <option value="Digital Dreams">Digital Dreams</option>
            <option value="Solana Legends">Solana Legends</option>
          </select>

          <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500" />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Choose the collection where this NFT will be minted.
        </p>
      </div>

      {/* ROYALTY */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          Royalty Percentage <span className="text-red-400">*</span>
        </label>

        <div className="relative">
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={royalty}
            onChange={(event) => onRoyaltyChange(event.target.value)}
            className="w-full rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 pr-12 text-sm text-white outline-none focus:border-purple-500"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            %
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Set your royalty between 0% - 10%
        </p>
      </div>

      {/* TRAITS */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium">
            Attributes / Traits{" "}
            <span className="text-xs text-slate-500">(Optional)</span>
          </label>

          <button
            type="button"
            onClick={onAddTrait}
            className="rounded-full border border-cyan-500/40 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/10"
          >
            Add Trait
          </button>
        </div>

        <div className="space-y-3">
          {traits.map((trait, index) => (
            <div key={index} className="flex gap-2">
              <div className="relative w-1/2">
                <input
                  value={trait.trait_type}
                  onChange={(event) =>
                    onUpdateTrait(index, "trait_type", event.target.value)
                  }
                  placeholder="Trait type"
                  className="w-full rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                />

                <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600" />
              </div>

              <div className="relative flex-1">
                <input
                  value={trait.value}
                  onChange={(event) =>
                    onUpdateTrait(index, "value", event.target.value)
                  }
                  placeholder="Trait value"
                  className="w-full rounded-xl border border-blue-500/30 bg-[#06172f] px-4 py-3 pr-10 text-sm text-white outline-none focus:border-purple-500"
                />

                <button
                  type="button"
                  onClick={() => onRemoveTrait(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-red-400"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddTrait}
          className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-500/30 px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <FaPlus />
          Add Another Trait
        </button>
      </div>

      {/* EXTERNAL URL */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          External URL{" "}
          <span className="text-xs text-slate-500">(Optional)</span>
        </label>

        <div className="relative">
          <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="url"
            value={externalUrl}
            onChange={(event) => onExternalUrlChange(event.target.value)}
            placeholder="https://your-website.com"
            className="w-full rounded-xl border border-blue-500/30 bg-[#06172f] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Link to your project, website or social media.
        </p>
      </div>
    </section>
  );
}
