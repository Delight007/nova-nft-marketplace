"use client";

import { getMyActivity } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const MY_ACTIVITY_QUERY_KEY = ["myActivity"] as const;

export function useMyActivity(enabled = true) {
  return useQuery({
    queryKey: MY_ACTIVITY_QUERY_KEY,
    queryFn: getMyActivity,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}
