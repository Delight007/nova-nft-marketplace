"use client";

import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

export function useMyProfile() {
  return useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    retry: false,
    staleTime: 60_000,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: async (user: UserProfile) => {
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, user);

      // Keep the existing authentication cache in sync if it exists.
      queryClient.setQueryData(["currentUser"], (current: unknown) => {
        if (!current || typeof current !== "object") {
          return current;
        }

        return {
          ...(current as Record<string, unknown>),
          ...user,
        };
      });

      await queryClient.invalidateQueries({
        queryKey: MY_PROFILE_QUERY_KEY,
      });
    },
  });
}
