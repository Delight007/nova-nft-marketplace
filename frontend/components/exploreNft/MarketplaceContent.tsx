import MarketplaceSidebar from "./marketplaceSidebar";
import NFTGrid from "./NFTGrid";

export default function MarketplaceContent() {
  return (
    <section className="container mx-auto px-6 py-8 lg:px-10">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Left sidebar */}
        <div className="hidden lg:block">
          <MarketplaceSidebar />
        </div>

        {/* Right NFT grid */}
        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Explore Collections
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Discover unique digital assets on Solana
              </p>
            </div>

            <span className="text-xs text-slate-500">6 items</span>
          </div>

          <NFTGrid />
        </div>
      </div>
    </section>
  );
}
