"use client";

import { useCollectionDetails } from "@/hooks/use-collection-details";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiTag } from "react-icons/fi";
import BuyNFTModal from "./collectionItems/BuyNFTModal";
import CollectionActivityFeed from "./collectionItems/CollectionActivityFeed";
import CollectionItemsBars from "./collectionItems/CollectionItemsBars";
import CollectionItemsFilters from "./collectionItems/CollectionItemsFilters";
import CollectionItemsGrid from "./collectionItems/CollectionItemsGrid";
import WalletVerificationModal from "@/components/wallet/walletVerificationModal";
import type {
  CollectionItemsTab,
  NFTItem,
} from "./collectionItems/collectionItemsData";

type CollectionItemsProps = {
  slug: string;
  onBuy?: (item: NFTItem) => void;
  onListForSale?: (item: NFTItem) => void;
  onOpenNFT?: (item: NFTItem) => void;
};

const DEFAULT_TRAITS: NFTItem["traits"] = {
  Background: "Unknown",
  Eyes: "Unknown",
  Headwear: "Unknown",
  Clothing: "Unknown",
  Accessories: "Unknown",
};

const VALID_RARITIES: NFTItem["rarity"][] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

function getRarity(attributes: unknown): NFTItem["rarity"] {
  if (!Array.isArray(attributes)) return "Common";

  const rarityAttribute = attributes.find(
    (attribute) =>
      attribute &&
      typeof attribute === "object" &&
      "trait_type" in attribute &&
      String(attribute.trait_type).toLowerCase() === "rarity" &&
      "value" in attribute,
  );

  if (!rarityAttribute) return "Common";

  const value = String(rarityAttribute.value);
  return VALID_RARITIES.includes(value as NFTItem["rarity"])
    ? (value as NFTItem["rarity"])
    : "Common";
}

function getTraits(attributes: unknown): NFTItem["traits"] {
  const traits = { ...DEFAULT_TRAITS };

  if (!Array.isArray(attributes)) return traits;

  const traitMap: Record<string, keyof NFTItem["traits"]> = {
    background: "Background",
    eyes: "Eyes",
    headwear: "Headwear",
    clothing: "Clothing",
    accessories: "Accessories",
  };

  for (const attribute of attributes) {
    if (
      !attribute ||
      typeof attribute !== "object" ||
      !("trait_type" in attribute) ||
      !("value" in attribute)
    ) {
      continue;
    }

    const key = traitMap[String(attribute.trait_type).toLowerCase()];
    if (key) traits[key] = String(attribute.value);
  }

  return traits;
}

export default function CollectionItems({
  slug,
  onBuy,
  onListForSale,
  onOpenNFT,
}: CollectionItemsProps) {
  const {
    data: collection,
    isPending,
    isError,
    error,
  } = useCollectionDetails(slug);

  const { connected, publicKey } = useWallet();
  const connectedWallet = publicKey?.toBase58() ?? null;
  const { data: currentUser } = useCurrentUser(
    connected && Boolean(connectedWallet),
  );
  const isWalletVerified =
    connected && currentUser?.wallet === connectedWallet;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<CollectionItemsTab>("Items");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<
    Record<string, string[]>
  >({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Rarity",
    "Traits",
    "Status",
    "Sale Type",
  ]);

  const [selectedNFTForPurchase, setSelectedNFTForPurchase] =
    useState<NFTItem | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const handleOpenNFT = (item: NFTItem) => {
    if (onOpenNFT) {
      onOpenNFT(item);
      return;
    }

    router.push(`/nft/${encodeURIComponent(item.id)}`);
  };

  const clearFilters = () => {
    setSelectedRarities([]);
    setSelectedTraits({});
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  const nftItems = useMemo<NFTItem[]>(() => {
    if (!collection) return [];

    return collection.nfts.map((nft) => {
      const listed = nft.listing !== null;
      const listedAt = nft.listing?.listedAt ?? null;

      const listedDaysAgo = listedAt
        ? Math.max(
            0,
            Math.floor(
              (Date.now() - new Date(listedAt).getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0;

      return {
        id: nft.id,
        mintAddress: nft.mintAddress,
        name: nft.name,
        collection: collection.name,
        image: nft.image,
        price: nft.listing?.price ?? null,
        rarity: getRarity(nft.attributes),
        status: listed ? "Listed" : "Buy Now",
        isOwner:
          Boolean(connectedWallet) &&
          nft.ownerWallet.toLowerCase() === connectedWallet?.toLowerCase(),
        listedAt,
        listedDaysAgo,
        owners: "1",
        verified: collection.verified,
        traits: getTraits(nft.attributes),
      };
    });
  }, [collection, connectedWallet]);

  const filteredNFTs = useMemo(() => {
    const result = nftItems.filter((item) => {
      const normalizedSearch = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.collection.toLowerCase().includes(normalizedSearch) ||
        item.id.toLowerCase().includes(normalizedSearch);

      const matchesRarity =
        selectedRarities.length === 0 || selectedRarities.includes(item.rarity);

      const matchesPrice =
        (minPrice === "" ||
          (item.price !== null && item.price >= Number(minPrice))) &&
        (maxPrice === "" ||
          (item.price !== null && item.price <= Number(maxPrice)));

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.some((status) => {
          if (status === "Buy Now") return item.status === "Buy Now";
          if (status === "Listed") return item.status === "Listed";
          if (status === "Has Offers") return false;
          return true;
        });

      const matchesTraits = Object.entries(selectedTraits).every(
        ([trait, values]) =>
          values.length === 0 ||
          values.includes(item.traits[trait as keyof NFTItem["traits"]]),
      );

      return (
        matchesSearch &&
        matchesRarity &&
        matchesPrice &&
        matchesStatus &&
        matchesTraits
      );
    });

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          (a.price ?? Number.POSITIVE_INFINITY) -
          (b.price ?? Number.POSITIVE_INFINITY),
      );
    }
    if (sortBy === "price-high") {
      result.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    }
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "recent") {
      result.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    }

    return result;
  }, [
    nftItems,
    search,
    selectedRarities,
    selectedTraits,
    selectedStatuses,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const usdPrice = (price: number) =>
    (price * 120).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const hasActiveFilters =
    selectedRarities.length > 0 ||
    selectedStatuses.length > 0 ||
    Object.values(selectedTraits).some((values) => values.length > 0) ||
    minPrice !== "" ||
    maxPrice !== "";

  const filterProps = {
    mobileFiltersOpen,
    onCloseMobileFilters: () => setMobileFiltersOpen(false),
    selectedRarities,
    setSelectedRarities,
    selectedTraits,
    setSelectedTraits,
    selectedStatuses,
    setSelectedStatuses,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    expandedSections,
    setExpandedSections,
    onClearFilters: clearFilters,
  };

  return (
    <section className="min-h-screen bg-[#020817] px-3 pb-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <CollectionItemsBars
          activeTab={activeTab}
          onTabChange={setActiveTab}
          itemCount={collection?.nfts.length ?? 0}
          search={search}
          onSearchChange={setSearch}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          gridView={gridView}
          onGridViewChange={setGridView}
          selectedRarities={selectedRarities}
          onRemoveRarity={(rarity) =>
            setSelectedRarities((current) =>
              current.filter((item) => item !== rarity),
            )
          }
          selectedStatuses={selectedStatuses}
          onRemoveStatus={(status) =>
            setSelectedStatuses((current) =>
              current.filter((item) => item !== status),
            )
          }
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {activeTab === "Items" ? (
          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[265px_minmax(0,1fr)] xl:gap-7">
            <div className="hidden lg:block">
              <CollectionItemsFilters variant="sidebar" {...filterProps} />
            </div>

            <div className="min-w-0">
              {!slug || isPending ? (
                <div
                  aria-live="polite"
                  className="flex min-h-80 items-center justify-center rounded-xl border border-white/10 bg-[#030b19] text-sm text-slate-400"
                >
                  Loading collection items...
                </div>
              ) : isError || !collection ? (
                isAxiosError(error) && error.response?.status === 404 ? (
                  <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#030b19] px-6 text-center">
                    <p className="text-sm text-slate-400">
                      There are no items to show because this collection could
                      not be found.
                    </p>
                    <Link
                      href="/collections"
                      className="mt-4 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
                    >
                      Browse collections
                    </Link>
                  </div>
                ) : (
                  <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#030b19] px-6 text-center">
                    <p className="text-sm text-rose-400">
                      {error instanceof Error
                        ? error.message
                        : "Unable to load this collection's NFTs."}
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
                    >
                      Try again
                    </button>
                  </div>
                )
              ) : (
                <CollectionItemsGrid
                  items={filteredNFTs}
                  totalItems={nftItems.length}
                  gridView={gridView}
                  favorites={favorites}
                  usdPrice={usdPrice}
                  onToggleFavorite={(id) =>
                    setFavorites((current) =>
                      current.includes(id)
                        ? current.filter((favorite) => favorite !== id)
                        : [...current, id],
                    )
                  }
                  onClearFilters={clearFilters}
                  onBuy={(item) => {
                    setSelectedNFTForPurchase(item);
                    if (!isWalletVerified) {
                      setVerificationModalOpen(true);
                    } else if (onBuy) {
                      onBuy(item);
                    } else {
                      setPurchaseModalOpen(true);
                    }
                  }}
                  onListForSale={onListForSale}
                  onOpenNFT={handleOpenNFT}
                />
              )}
            </div>
          </div>
        ) : activeTab === "Activity" ? (
          <CollectionActivityFeed slug={slug} />
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300">
              <FiTag size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">
              Collection Offers
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              Offers made on NFTs in this collection will appear here once
              offer data is connected.
            </p>
          </div>
        )}

        <CollectionItemsFilters variant="mobile" {...filterProps} />
        {selectedNFTForPurchase && purchaseModalOpen && (
          <BuyNFTModal
            nft={selectedNFTForPurchase}
            collectionSlug={slug}
            onClose={() => {
              setPurchaseModalOpen(false);
              setSelectedNFTForPurchase(null);
            }}
            onSuccess={() => {
              setPurchaseModalOpen(false);
              setSelectedNFTForPurchase(null);
            }}
          />
        )}
        <WalletVerificationModal
          isOpen={verificationModalOpen}
          onClose={() => {
            setVerificationModalOpen(false);
            setSelectedNFTForPurchase(null);
          }}
          onVerified={() => {
            setVerificationModalOpen(false);
            if (onBuy && selectedNFTForPurchase) {
              onBuy(selectedNFTForPurchase);
              setSelectedNFTForPurchase(null);
            } else {
              setPurchaseModalOpen(true);
            }
          }}
        />
      </div>
    </section>
  );
}
