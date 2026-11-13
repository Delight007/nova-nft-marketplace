"use client";

import { useState, useSyncExternalStore } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

import CollectedNfts from "@/components/profile/collectedNfts";
import CreatorAnalytics from "@/components/profile/creatorAnalytics";
import ProfileActivity from "@/components/profile/profileActivity";
import ProfileHero from "@/components/profile/profileHero";
import ProfileTabs, {
  type ProfileTabName,
} from "@/components/profile/profileTabs";
import TopCollections from "@/components/profile/topCollections";
import ProfileSocials from "./profileSocial";
import WalletVerificationModal from "@/components/wallet/walletVerificationModal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMyProfile } from "@/hooks/use-my-profile";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function ProfileLoadingState() {
  return (
    <section
      className="container flex min-h-[70vh] items-center justify-center bg-[#020817] text-sm text-slate-400"
      role="status"
    >
      Loading your profile...
    </section>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTabName>("Collected");
  const [setupPromptOpen, setSetupPromptOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();
  const { data: currentUser } = useCurrentUser(
    connected && Boolean(walletAddress),
  );
  const isVerified =
    connected &&
    Boolean(walletAddress) &&
    currentUser?.wallet === walletAddress;
  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useMyProfile(isVerified);

  if (!isHydrated) {
    return <ProfileLoadingState />;
  }

  if (!isVerified) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center bg-[#020817] px-5 text-white">
        <p className="text-sm text-slate-400">
          Connect and verify your wallet to view your profile.
        </p>
        <WalletVerificationModal
          isOpen
          onClose={() => router.push("/")}
          onVerified={() => router.refresh()}
        />
      </section>
    );
  }

  if (isProfilePending) {
    return <ProfileLoadingState />;
  }

  if (isProfileError || !profile) {
    return (
      <section className="container flex min-h-[70vh] flex-col items-center justify-center bg-[#020817] px-5 text-center text-white">
        <p className="text-sm text-red-300">Unable to load your profile.</p>
        <button
          type="button"
          onClick={() => void refetchProfile()}
          className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          Try again
        </button>
      </section>
    );
  }

  if (!profile.username?.trim()) {
    return (
      <section className="container min-h-screen bg-[#020817] text-white">
        <ProfileHero
          forceEditOpen={editOpen}
          onEditClose={() => {
            setEditOpen(false);
            setSetupPromptOpen(true);
          }}
        />

        {setupPromptOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#01040c]/85 p-4 backdrop-blur-md">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-setup-title"
              className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#050b18] p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)]"
            >
              <h2
                id="profile-setup-title"
                className="text-xl font-semibold text-white"
              >
                Set up your profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose a username to finish setting up your verified account
                before accessing your profile.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSetupPromptOpen(false);
                  setEditOpen(true);
                }}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Edit profile
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="container min-h-screen bg-[#020817] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ProfileHero />

        <div className="mx-auto max-w-[1500px] px-6">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-1 gap-5 pb-20 lg:grid-cols-[minmax(0,1fr)_365px]">
            <section className="min-w-0">
              {activeTab === "Collected" && <CollectedNfts mode="collected" />}

              {activeTab === "Created" && <CollectedNfts mode="created" />}

              {activeTab === "Listed" && <CollectedNfts mode="listed" />}

              {activeTab === "Activity" && <ProfileActivity />}
            </section>

            <aside className="space-y-5 border-l border-white/5 pl-0 lg:pl-5 lg:py-6 py-4">
              <CreatorAnalytics />
              <TopCollections />
              <ProfileSocials />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
