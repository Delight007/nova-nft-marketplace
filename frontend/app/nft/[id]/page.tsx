import { Suspense } from "react";
import NFTDetails from "@/components/nft/NFTDetails";

type NFTPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function NFTPage({ params }: NFTPageProps) {
  return (
    <Suspense
      fallback={
        <section
          aria-label="Loading NFT"
          className="container flex min-h-screen items-center justify-center bg-[#020814] text-blue-200"
        >
          <p role="status">Loading NFT...</p>
        </section>
      }
    >
      <NFTPageContent params={params} />
    </Suspense>
  );
}

async function NFTPageContent({ params }: NFTPageProps) {
  const { id } = await params;

  return <NFTDetails id={id} />;
}
