import FeaturedNfts from "@/components/featuredNfts";
import Hero from "@/components/hero";
import TrendingCollections from "@/components/trendingCollections";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedNfts />
      <TrendingCollections />
    </main>
  );
}
