"use client";

import { useState } from "react";
import CreateNftDetails from "./createNftDetails";
import NftPreview from "./createNftReview";
import CreateSteps from "./createSteps";
import UploadArtwork from "./uploadArtWork";

export interface Trait {
  trait_type: string;
  value: string;
}

export default function CreatePage() {
  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [collection, setCollection] = useState("Neon Realms");

  const [royalty, setRoyalty] = useState("5");

  const [externalUrl, setExternalUrl] = useState("");

  const [traits, setTraits] = useState<Trait[]>([
    {
      trait_type: "Background",
      value: "Neon City",
    },
    {
      trait_type: "Rarity",
      value: "Legendary",
    },
    {
      trait_type: "Type",
      value: "Character",
    },
  ]);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const addTrait = () => {
    setTraits((prev) => [
      ...prev,
      {
        trait_type: "",
        value: "",
      },
    ]);
  };

  const updateTrait = (
    index: number,
    field: "trait_type" | "value",
    value: string,
  ) => {
    setTraits((prev) =>
      prev.map((trait, i) =>
        i === index
          ? {
              ...trait,
              [field]: value,
            }
          : trait,
      ),
    );
  };

  const removeTrait = (index: number) => {
    setTraits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMint = () => {
    console.log({
      image,
      name,
      description,
      collection,
      royalty,
      externalUrl,
      traits,
    });

    // Solana mint logic will be added here later.
  };

  return (
    <section className=" container min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-10 lg:px-10">
        <div className="grid gap-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-2 text-xs font-medium text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                SOLANA NFT MARKETPLACE
              </div>

              <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                Create{" "}
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                  NFT
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 md:text-base">
                Turn your creativity into digital ownership. Mint your NFT on
                Solana and bring your vision to the blockchain.
              </p>
            </div>

            <CreateSteps />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
            <UploadArtwork image={image} onImageChange={handleImageChange} />
            <CreateNftDetails
              name={name}
              description={description}
              collection={collection}
              royalty={royalty}
              externalUrl={externalUrl}
              traits={traits}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onCollectionChange={setCollection}
              onRoyaltyChange={setRoyalty}
              onExternalUrlChange={setExternalUrl}
              onAddTrait={addTrait}
              onUpdateTrait={updateTrait}
              onRemoveTrait={removeTrait}
            />
            <NftPreview
              image={image}
              name={name}
              collection={collection}
              royalty={royalty}
              traits={traits}
              onMint={handleMint}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
