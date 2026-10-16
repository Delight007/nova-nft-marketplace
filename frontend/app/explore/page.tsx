import ExploreHero from "@/components/exploreNft/exploreHero";
import MarketplaceContent from "@/components/exploreNft/MarketplaceContent";
import MarketplaceFilters from "@/components/exploreNft/MarketplaceFilters";

export default function page() {
  return (
    <main>
      <ExploreHero />
      <MarketplaceFilters />
      <MarketplaceContent />
    </main>
  );
}
