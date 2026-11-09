import axios from "axios";
import bs58 from "bs58";
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

export async function authenticateWalletSession(
  wallet: string,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
): Promise<CurrentUser> {
  const challengeResponse = await api.post<{
    success: boolean;
    message?: string;
    data: { message: string };
  }>("/api/auth/challenge", { wallet });
  const challenge = challengeResponse.data;

  if (!challenge.success) {
    throw new Error(challenge.message ?? "Unable to request sign-in challenge.");
  }

  const signature = bs58.encode(
    await signMessage(new TextEncoder().encode(challenge.data.message)),
  );
  const verifyResponse = await api.post<{
    success: boolean;
    message?: string;
  }>("/api/auth/verify", { wallet, signature });

  if (!verifyResponse.data.success) {
    throw new Error(
      verifyResponse.data.message ?? "Wallet verification failed.",
    );
  }

  const user = await getCurrentUser();

  if (!user || user.wallet !== wallet) {
    throw new Error("Session verification failed. Please try again.");
  }

  return user;
}
