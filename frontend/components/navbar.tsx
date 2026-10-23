"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import bs58 from "bs58";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiSearch, FiSun } from "react-icons/fi";
import {
  CURRENT_USER_QUERY_KEY,
  useCurrentUser,
} from "@/hooks/use-current-user";
import { api } from "@/lib/axios";
import { getCurrentUser } from "@/lib/auth";

const navLinks = [
  { name: "Explore", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Activity", href: "/activity" },
  { name: "Create", href: "/create" },
];

export default function Navbar() {
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const queryClient = useQueryClient();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const walletAddress = publicKey?.toBase58();
  const { data: currentUser, isPending: isCheckingSession } = useCurrentUser(
    connected && Boolean(walletAddress),
  );
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "";

  async function authenticateWallet() {
    if (!walletAddress || !signMessage) {
      setAuthError(
        "This wallet does not support message signing. Try another compatible wallet.",
      );
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      // 1. Request a one-time challenge from the backend.
      const challengeResponse = await api.post<{
        success: boolean;
        message?: string;
        data: { message: string };
      }>("/api/auth/challenge", { wallet: walletAddress });
      const challengeResult = challengeResponse.data;

      if (!challengeResult.success) {
        throw new Error(
          challengeResult.message ?? "Unable to request sign-in challenge.",
        );
      }

      const message: string = challengeResult.data.message;

      // 2. Ask the wallet to sign the exact message.
      const signatureBytes = await signMessage(
        new TextEncoder().encode(message),
      );

      const signature = bs58.encode(signatureBytes);

      // 3. Verify the signature and receive the session cookie.
      const verifyResponse = await api.post<{
        success: boolean;
        message?: string;
      }>("/api/auth/verify", {
        wallet: walletAddress,
        signature,
      });
      const verifyResult = verifyResponse.data;

      if (!verifyResult.success) {
        throw new Error(verifyResult.message ?? "Wallet verification failed.");
      }

      const user = await queryClient.fetchQuery({
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: getCurrentUser,
        staleTime: 0,
      });

      if (!user || user.wallet !== walletAddress) {
        throw new Error("Session verification failed. Please try again.");
      }
    } catch (error) {
      setAuthError(
        axios.isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? error.message)
          : error instanceof Error
            ? error.message
            : "Wallet authentication failed.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      // Clear the backend session cookie.
      const response = await api.post<{ success: boolean }>(
        "/api/auth/logout",
      );

      if (!response.data.success) {
        throw new Error("Unable to end the server session.");
      }
      setAuthError("");
    } catch {
      setAuthError("Could not end the server session. Please try again.");
    } finally {
      try {
        await disconnect();
      } catch (error) {
        setAuthError(
          error instanceof Error ? error.message : "Failed to disconnect wallet.",
        );
      } finally {
        setAccountMenuOpen(false);
        queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
        await queryClient.invalidateQueries({
          queryKey: CURRENT_USER_QUERY_KEY,
        });
      }
    }
  }

  return (
    <section className="container border-b border-white/10 bg-[#030712]">
      <nav className="z-10 mx-auto flex h-14 max-w-7xl items-center px-4 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="relative mr-14 flex h-7 w-[140px] shrink-0 items-center overflow-hidden"
        >
          <Image
            src="/images/logo.png"
            fill
            sizes="140px"
            alt="NOVA"
            className="object-cover"
          />
        </Link>

        {/* Navigation */}
        <div className="flex h-full items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex h-full items-center text-sm transition ${
                link.name === "Explore"
                  ? "font-medium text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.name}
              {link.name === "Explore" && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-purple-500 to-cyan-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-5">
          {/* Search */}
          <div className="flex h-9 w-[350px] items-center rounded-full border border-blue-500/40 bg-[#071226] px-4">
            <FiSearch className="mr-3 shrink-0 text-base text-slate-400" />
            <input
              type="text"
              placeholder="Search collections, NFTs, creators..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-slate-400">
              /
            </span>
          </div>

          {/* Theme */}
          <button
            type="button"
            className="text-slate-400 transition hover:text-white"
            aria-label="Toggle theme"
          >
            <FiSun className="text-xl" />
          </button>

          {/* Wallet */}
          {!connected ? (
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                aria-expanded={accountMenuOpen}
              >
                {shortAddress}
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/10 bg-[#071226] p-2 shadow-xl">
                  <p className="break-all px-3 py-2 text-xs text-slate-400">
                    {walletAddress}
                  </p>

                  <div className="px-3 py-2">
                    {isCheckingSession ? (
                      <p className="text-sm text-slate-400">
                        Checking session...
                      </p>
                    ) : currentUser?.wallet === walletAddress ? (
                      <p className="text-sm text-emerald-400">
                        Wallet verified
                      </p>
                    ) : (
                      <button
                        type="button"
                        disabled={authLoading}
                        onClick={authenticateWallet}
                        className="w-full cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {authLoading ? "Verifying..." : "Verify wallet"}
                      </button>
                    )}

                    {authError && (
                      <p
                        role="alert"
                        className="mt-2 break-words text-xs text-red-400"
                      >
                        {authError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5"
                  >
                    Disconnect wallet
                  </button>
                </div>
              )}
            </div>
          )}
          {!connected && authError && (
            <p role="alert" className="max-w-48 text-xs text-red-400">
              {authError}
            </p>
          )}
        </div>
      </nav>
    </section>
  );
}
