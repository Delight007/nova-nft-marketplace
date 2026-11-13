"use client";

import { getSolUsdPrice } from "@/services/activity";
import { useQuery } from "@tanstack/react-query";

export function useSolUsdPrice() {
  return useQuery({
    queryKey: ["sol-usd-price"],
    queryFn: getSolUsdPrice,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: false,
  });
}
