"use client";

import { useCreateNFT } from "@/hooks/use-create-nft";
import { useMyProfile } from "@/hooks/use-my-profile";
import { uploadNFTArtworkToCloudinary } from "@/lib/nftCloudinary";
import { useEffect, useState } from "react";
import CreateNftDetails from "./createNftDetails";
import NftPreview from "./createNftReview";
import CreateSteps from "./createSteps";
import UploadArtwork from "./uploadArtWork";

export interface Trait {
  trait_type: string;
  value: string;
}

export default function CreatePage() {
  const { data: profile } = useMyProfile();
  const createNFTMutation = useCreateNFT();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [collection, setCollection] = useState("Neon Realms");

  const [royalty, setRoyalty] = useState("5");

  const [externalUrl, setExternalUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImageChange = (file: File) => {
    setImageFile(file);

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

  const handleMint = async () => {
    setSuccessMessage(null);
    if (!imageFile) {
      setUploadError("Please select your NFT artwork first.");
      return;
    }

    if (!name.trim()) {
      setUploadError("Please enter an NFT name.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Step 1: Upload artwork to Cloudinary.
      const artworkUrl = await uploadNFTArtworkToCloudinary(imageFile);

      // Step 2: Save the NFT details in PostgreSQL.
      const result = await createNFTMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        image: artworkUrl,
        attributes: traits.filter(
          (trait) => trait.trait_type.trim() && trait.value.trim(),
        ),
      });
      setSuccessMessage(
        "NFT saved successfully! On-chain minting is coming next.",
      );
      console.log("NFT saved:", result.nft);

      // Actual Solana minting will be implemented later.
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to create NFT.",
      );
    } finally {
      setIsUploading(false);
    }
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

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Create{" "}
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                  NFT
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 md:text-sm font-medium">
                Turn your creativity into digital ownership. Mint your NFT on
                Solana and bring your vision to the blockchain.
              </p>
            </div>

            <CreateSteps />
          </div>
          {successMessage && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {successMessage}
            </p>
          )}
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
              username={profile?.username ?? null}
              royalty={royalty}
              traits={traits}
              onMint={handleMint}
              isUploading={isUploading}
              uploadError={uploadError}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
