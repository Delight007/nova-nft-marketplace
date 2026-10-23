import axios from "axios";
import { api } from "@/lib/axios";

export type CurrentUser = {
  id: string;
  wallet: string;
  username: string | null;
  avatar: string | null;
  createdAt: string;
};

type CurrentUserResponse = {
  success: boolean;
  data: {
    user: CurrentUser;
  };
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await api.get<CurrentUserResponse>("/api/auth/me");
    return response.data.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}
