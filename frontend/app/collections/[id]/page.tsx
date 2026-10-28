// "use client";

// import CollectionDetails from "@/components/collections/collectionDetails";
// import CollectionItems from "@/components/collections/CollectionItems";

// export default function page() {
//   return (
//     <main>
//       <CollectionDetails />
//       {/* Items, Activity, Offers and filters */}
//       <CollectionItems
//         onBuy={(nft) => {
//           console.log("Buy NFT:", nft.id);
//           // Connect your purchase flow here.
//         }}
//         onListForSale={(nft) => {
//           console.log("List NFT:", nft.id);
//           // Open your listing flow here.
//         }}
//         onOpenNFT={(nft) => {
//           console.log("Open NFT details:", nft.id);
//           // Navigate to your NFT details route here.
//         }}
//       />
//     </main>
//   );
// }

"use client";

import CollectionDetails from "@/components/collections/collectionDetails";
import CollectionItems from "@/components/collections/CollectionItems";
import { useParams } from "next/navigation";

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <main>
      <CollectionDetails slug={slug} />

      <CollectionItems
        slug={slug}
        onBuy={(nft) => {
          console.log("Buy NFT:", nft.id);
          // Connect your purchase flow here.
        }}
        onListForSale={(nft) => {
          console.log("List NFT:", nft.id);
          // Open your listing flow here.
        }}
        onOpenNFT={(nft) => {
          console.log("Open NFT details:", nft.id);
          // Navigate to your NFT details route here.
        }}
      />
    </main>
  );
}
