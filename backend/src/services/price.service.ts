type CoinGeckoPriceResponse = {
  solana?: {
    usd?: number;
    last_updated_at?: number;
  };
};

type SolPrice = {
  usd: number;
  updatedAt: string;
};

let cachedPrice: SolPrice | null = null;
let cacheExpiresAt = 0;

const CACHE_DURATION = 60 * 1000;

export async function getSolUsdPrice(): Promise<SolPrice> {
  if (cachedPrice && Date.now() < cacheExpiresAt) {
    return cachedPrice;
  }

  const apiKey = process.env.COINGECKO_API_KEY;

  if (!apiKey) {
    throw new Error("COINGECKO_API_KEY is not configured");
  }

  const url = new URL("https://api.coingecko.com/api/v3/simple/price");

  url.searchParams.set("ids", "solana");
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("include_last_updated_at", "true");

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoPriceResponse;
  const usd = data.solana?.usd;

  if (typeof usd !== "number" || !Number.isFinite(usd)) {
    throw new Error("Invalid SOL price returned by CoinGecko");
  }

  cachedPrice = {
    usd,
    updatedAt: data.solana?.last_updated_at
      ? new Date(data.solana.last_updated_at * 1000).toISOString()
      : new Date().toISOString(),
  };

  cacheExpiresAt = Date.now() + CACHE_DURATION;

  return cachedPrice;
}
