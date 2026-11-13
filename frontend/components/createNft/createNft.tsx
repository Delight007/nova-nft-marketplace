"use client";

import { useCreateNFT, useUpdateNFTMint } from "@/hooks/use-create-nft";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMyProfile } from "@/hooks/use-my-profile";
import { uploadNFTArtworkToCloudinary } from "@/lib/nftCloudinary";
import { mintNFT } from "@/lib/solana/mint-nft";
import { createWalletUmi } from "@/lib/solana/umi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import WalletVerificationModal from "@/components/wallet/walletVerificationModal";
import ProfileEditModal from "@/components/profile/profileEdithModal";
import CreateNftDetails from "./createNftDetails";
import NftPreview from "./createNftReview";
import CreateSteps from "./createSteps";
import UploadArtwork from "./uploadArtWork";

export interface Trait {
  trait_type: string;
  value: string;
}

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function CreatePageLoadingState() {
  return (
    <section
      className="container flex min-h-[70vh] items-center justify-center bg-[#020817] text-sm text-slate-400"
      role="status"
    >
      Loading...
    </section>
  );
}

export default function CreatePage() {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const router = useRouter();
  const { connected, publicKey, wallet } = useWallet();
  const walletAddress = publicKey?.toBase58();
  const { data: currentUser } = useCurrentUser(
    connected && Boolean(walletAddress),
  );
  const isVerified =
    connected &&
    Boolean(walletAddress) &&
    currentUser?.wallet === walletAddress;
  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useMyProfile(isVerified);
  const createNFTMutation = useCreateNFT();

  const updateNFTMintMutation = useUpdateNFTMint();
  const [setupPromptOpen, setSetupPromptOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [collection, setCollection] = useState("");

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

  if (!isHydrated) {
    return <CreatePageLoadingState />;
  }

  if (!isVerified) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center bg-[#020817] px-5 text-white">
        <p className="text-sm text-slate-400">
          Connect and verify your wallet to create an NFT.
        </p>
        <WalletVerificationModal
          isOpen
          onClose={() => router.push("/")}
          onVerified={() => router.refresh()}
        />
      </section>
    );
  }

  if (isProfilePending) {
    return <CreatePageLoadingState />;
  }

  if (isProfileError) {
    return (
      <section className="container flex min-h-[70vh] flex-col items-center justify-center bg-[#020817] px-5 text-center text-white">
        <p className="text-sm text-red-300">Unable to load your profile.</p>
        <button
          type="button"
          onClick={() => void refetchProfile()}
          className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!profile?.username?.trim()) {
    return (
      <section className="container min-h-screen bg-[#020817] text-white">
        {setupPromptOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#01040c]/85 p-4 backdrop-blur-md">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-profile-setup-title"
              className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#050b18] p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]"
            >
              <h2
                id="create-profile-setup-title"
                className="text-xl font-semibold text-white"
              >
                Set up your profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose a username before creating an NFT.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSetupPromptOpen(false);
                  setEditOpen(true);
                }}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Edit profile
              </button>
            </div>
          </div>
        )}
        {editOpen && (
          <ProfileEditModal
            onClose={() => {
              setEditOpen(false);
              setSetupPromptOpen(true);
            }}
          />
        )}
      </section>
    );
  }

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

  // const handleMint = async () => {
  //   setSuccessMessage(null);
  //   if (!imageFile) {
  //     setUploadError("Please select your NFT artwork first.");
  //     return;
  //   }

  //   if (!name.trim()) {
  //     setUploadError("Please enter an NFT name.");
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     setUploadError(null);

  //     // Step 1: Upload artwork to Cloudinary.
  //     const artworkUrl = await uploadNFTArtworkToCloudinary(imageFile);

  //     // Step 2: Save the NFT details in PostgreSQL.
  //     const result = await createNFTMutation.mutateAsync({
  //       name: name.trim(),
  //       description: description.trim(),
  //       image: artworkUrl,
  //       attributes: traits.filter(
  //         (trait) => trait.trait_type.trim() && trait.value.trim(),
  //       ),
  //     });
  //     setSuccessMessage(
  //       "NFT saved successfully! On-chain minting is coming next.",
  //     );
  //     console.log("NFT saved:", result.nft);

  //     // Actual Solana minting will be implemented later.
  //   } catch (error) {
  //     setUploadError(
  //       error instanceof Error ? error.message : "Failed to create NFT.",
  //     );
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleMint = async () => {
    setSuccessMessage(null);
    setUploadError(null);

    if (!connected || !wallet) {
      setUploadError("Please connect your Solana wallet first.");
      return;
    }

    if (!imageFile) {
      setUploadError("Please select your NFT artwork first.");
      return;
    }

    if (!name.trim()) {
      setUploadError("Please enter an NFT name.");
      return;
    }

    if (!collection.trim()) {
      setUploadError("Please enter a collection name.");
      return;
    }

    const royaltyValue = Number(royalty);

    if (
      !Number.isFinite(royaltyValue) ||
      royaltyValue < 0 ||
      royaltyValue > 100
    ) {
      setUploadError("Royalty must be between 0 and 100.");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload artwork to Cloudinary.
      const artworkUrl = await uploadNFTArtworkToCloudinary(imageFile);

      // Step 2: Save NFT details in PostgreSQL.
      const result = await createNFTMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        image: artworkUrl,
        collection: collection.trim(),
        attributes: traits.filter(
          (trait) => trait.trait_type.trim() && trait.value.trim(),
        ),
      });

      const nftId = result.nft.id;

      // Step 3: Create Umi using the connected wallet.
      const umi = createWalletUmi(wallet.adapter);

      // Step 4: Upload metadata and mint the NFT on Solana.
      const mintedNFT = await mintNFT(umi, {
        name: name.trim(),
        description: description.trim(),
        image: artworkUrl,
        collection: collection.trim(),
        royalty: royaltyValue,
        attributes: traits.filter(
          (trait) => trait.trait_type.trim() && trait.value.trim(),
        ),
      });

      // Step 5: Save the on-chain mint details in PostgreSQL.
      try {
        await updateNFTMintMutation.mutateAsync({
          nftId,
          mintAddress: mintedNFT.mintAddress,
          metadataUri: mintedNFT.metadataUri,
        });
      } catch {
        setUploadError(
          `Your NFT was minted successfully, but we couldn't save its mint details to the database. Mint address: ${mintedNFT.mintAddress}`,
        );
        return;
      }

      setSuccessMessage(
        `NFT minted successfully! Mint address: ${mintedNFT.mintAddress}`,
      );

      console.log(
        "Full transaction signature:",
        mintedNFT.transactionSignature,
      );
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to mint NFT.",
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
