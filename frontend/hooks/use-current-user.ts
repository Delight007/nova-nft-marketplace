"use client";

import { getCurrentUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export const CURRENT_USER_QUERY_KEY = ["currentUser"] as const;

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
