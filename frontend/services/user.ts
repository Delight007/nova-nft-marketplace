import { api } from "@/lib/axios";
import axios from "axios";

export type UserProfile = {
  id: string;
  wallet: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  discord: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProfileResponse = {
  success: boolean;
  message?: string;
  data: {
    user: UserProfile;
  };
};

export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get<ProfileResponse>("/api/users/me");
  return response.data.data.user;
}

export async function updateMyProfile(values: {
  username?: string;
  avatar?: string;
  bio?: string | null;
  website?: string;
  twitter?: string;
  discord?: string;
}): Promise<UserProfile> {
  const response = await api.patch<ProfileResponse>("/api/users/me", values);

  return response.data.data.user;
}

export function getProfileErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;

    return responseData?.message ?? "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}
