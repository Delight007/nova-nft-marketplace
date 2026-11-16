"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiSearch, FiUser, FiX } from "react-icons/fi";
import {
  CURRENT_USER_QUERY_KEY,
  useCurrentUser,
} from "@/hooks/use-current-user";
import { api } from "@/lib/axios";
import { authenticateWalletSession } from "@/lib/auth";
import WalletVerificationModal from "@/components/wallet/walletVerificationModal";
import { useNotify } from "@/components/providers/notification-provider";

const navLinks = [
  { name: "Explore", href: "/explore" },
  { name: "Collections", href: "/collections" },
  { name: "Activity", href: "/activity" },
  { name: "Create", href: "/create" },
];

export default function Navbar() {
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const queryClient = useQueryClient();
  const notify = useNotify();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [verifyOnConnect, setVerifyOnConnect] = useState(false);

  const walletAddress = publicKey?.toBase58();
  const { data: currentUser, isPending: isCheckingSession } = useCurrentUser(
    connected && Boolean(walletAddress),
  );
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "";

  async function authenticateWallet() {
    if (!walletAddress || !signMessage) {
      notify(
        "This wallet does not support message signing. Try another compatible wallet.",
        "error",
      );
      return;
    }

    setAuthLoading(true);

    try {
      const user = await authenticateWalletSession(walletAddress, signMessage);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      notify("Wallet verified successfully.", "success");
    } catch (error) {
      notify(
        axios.isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? error.message)
          : error instanceof Error
            ? error.message
            : "Wallet authentication failed.",
        "error",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleDisconnect() {
    let sessionEnded = false;

    try {
      // Clear the backend session cookie.
      const response = await api.post<{ success: boolean }>(
        "/api/auth/logout",
      );

      if (!response.data.success) {
        throw new Error("Unable to end the server session.");
      }
      sessionEnded = true;
    } catch {
      notify("Could not end the server session. Please try again.", "error");
    } finally {
      try {
        await disconnect();
        if (sessionEnded) notify("Wallet disconnected.", "success");
      } catch (error) {
        notify(
          error instanceof Error ? error.message : "Failed to disconnect wallet.",
          "error",
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
    <section className="container relative z-50 border-b border-white/10 bg-[#030712]">
      <nav className="mx-auto flex h-14 max-w-7xl items-center px-3 sm:px-4 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="relative mr-3 flex h-7 w-[112px] shrink-0 items-center overflow-hidden sm:mr-6 sm:w-[140px] xl:mr-14"
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
        <div className="hidden h-full items-center gap-6 lg:flex">
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
        <div className="ml-auto flex items-center gap-2 sm:gap-4 lg:gap-5">
          {/* Search */}
          <div className="hidden h-9 w-[300px] items-center rounded-full border border-blue-500/40 bg-[#071226] px-4 xl:flex 2xl:w-[350px]">
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

          {connected && (
            <Link
              href="/profile"
              className="hidden text-slate-400 transition hover:text-white lg:block"
              aria-label="Profile"
            >
              <FiUser className="text-xl" />
            </Link>
          )}

          {/* Wallet */}
          {!connected ? (
            <button
              type="button"
              onClick={() => {
                setVerifyOnConnect(true);
                setVisible(true);
              }}
              className="cursor-pointer whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-2 text-[11px] font-semibold text-white transition hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className="cursor-pointer whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-2 text-[11px] font-semibold text-white transition hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs"
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

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:border-cyan-400/50 hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="motion-safe:animate-[nova-fade-down_180ms_ease-out_both] border-t border-white/10 px-3 pb-4 pt-3 sm:px-4 lg:hidden">
          <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex min-h-11 items-center rounded-lg px-3 text-sm transition ${
                  link.name === "Explore"
                    ? "bg-white/[0.06] font-medium text-white"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {connected && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                Profile
              </Link>
            )}
          </nav>

          <label className="mt-3 flex h-11 items-center gap-3 rounded-xl border border-blue-500/30 bg-[#071226] px-3">
            <FiSearch className="shrink-0 text-slate-400" />
            <input
              type="search"
              placeholder="Search collections, NFTs, creators..."
              aria-label="Search collections, NFTs, and creators"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      )}

      <WalletVerificationModal
        isOpen={
          verifyOnConnect &&
          connected &&
          currentUser?.wallet !== walletAddress
        }
        onClose={() => setVerifyOnConnect(false)}
        onVerified={() => setVerifyOnConnect(false)}
      />
    </section>
  );
}
