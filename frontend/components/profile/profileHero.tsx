// "use client";

// import Image from "next/image";
// import {
//   FaCheck,
//   FaCopy,
//   FaEllipsisV,
//   FaGlobe,
//   FaLink,
//   FaShareAlt,
// } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";
// import { SiDiscord } from "react-icons/si";

// const creator = {
//   name: "NeonCreator",
//   username: "@NeonCreator",
//   wallet: "8xF3...9a2K",
//   bio: "Digital artist & creator of Neon Realms. Exploring the intersection of technology, art and imagination. Building a more colorful future on Solana.",
//   avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
//   banner: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
//   website: "neoncreator.xyz",
// };

// const stats = [
//   {
//     label: "NFTs Owned",
//     value: "24",
//   },
//   {
//     label: "Created",
//     value: "12",
//   },
//   {
//     label: "Listed",
//     value: "6",
//   },
//   {
//     label: "Volume Traded",
//     value: "523.4 SOL",
//   },
//   {
//     label: "Followers",
//     value: "8.7K",
//   },
// ];

// export default function ProfileHero() {
//   const copyWallet = async () => {
//     await navigator.clipboard.writeText("8xF3...9a2K");
//   };

//   return (
//     <section className="relative overflow-hidden border-b border-blue-500/10">
//       {/* BANNER */}
//       <div className="absolute inset-0">
//         <Image
//           src={creator.banner}
//           alt="Creator banner"
//           fill
//           priority
//           className="object-cover object-center"
//         />

//         <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/80 to-[#020817]/20" />

//         <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/30" />
//       </div>

//       <div className="relative mx-auto max-w-[1500px] px-6">
//         <div className="flex min-h-[285px] items-center gap-7 py-8 lg:min-h-[285px]">
//           {/* AVATAR */}
//           <div className="relative hidden shrink-0 md:block">
//             <div className="rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 p-[3px] shadow-[0_0_35px_rgba(168,85,247,0.3)]">
//               <div className="rounded-full bg-[#020817] p-1">
//                 <Image
//                   src={creator.avatar}
//                   alt={creator.name}
//                   width={145}
//                   height={145}
//                   className="h-[135px] w-[135px] rounded-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* PROFILE CONTENT */}
//           <div className="flex-1">
//             <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//               <div className="max-w-[650px]">
//                 {/* MOBILE AVATAR */}
//                 <div className="mb-5 md:hidden">
//                   <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 p-[3px]">
//                     <Image
//                       src={creator.avatar}
//                       alt={creator.name}
//                       width={100}
//                       height={100}
//                       className="h-[94px] w-[94px] rounded-full object-cover"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
//                     {creator.username}
//                   </h1>

//                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-[#020817]">
//                     <FaCheck />
//                   </span>
//                 </div>

//                 {/* WALLET */}
//                 <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
//                   <FaLink className="text-xs text-slate-500" />

//                   <span>{creator.wallet}</span>

//                   <button
//                     type="button"
//                     onClick={copyWallet}
//                     className="text-slate-500 transition hover:text-cyan-400"
//                   >
//                     <FaCopy />
//                   </button>
//                 </div>

//                 {/* BIO */}
//                 <p className="mt-4 max-w-[400px] text-sm leading-6 text-slate-300">
//                   {creator.bio}
//                 </p>

//                 {/* SOCIALS */}
//                 <div className="mt-5 flex items-center gap-5">
//                   <a
//                     href="#"
//                     className="text-slate-300 transition hover:text-white"
//                   >
//                     <FaXTwitter />
//                   </a>

//                   <a
//                     href="#"
//                     className="text-slate-300 transition hover:text-white"
//                   >
//                     <SiDiscord />
//                   </a>

//                   <a
//                     href="#"
//                     className="text-slate-300 transition hover:text-white"
//                   >
//                     <FaGlobe />
//                   </a>

//                   <a
//                     href="#"
//                     className="text-sm text-cyan-400 transition hover:text-cyan-300"
//                   >
//                     {creator.website}
//                   </a>
//                 </div>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex items-center gap-3">
//                 <button className="w-auto rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
//                   Edit Profile
//                 </button>

//                 <button className="rounded-xl border border-purple-500/60 bg-black/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500/10">
//                   Follow
//                 </button>

//                 <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-300 transition hover:border-purple-500/40 hover:text-white">
//                   <FaEllipsisV />
//                 </button>
//               </div>
//             </div>

//             {/* STATS */}
//             <div className="mt-7 flex flex-wrap items-center gap-y-5">
//               {stats.map((stat, index) => (
//                 <div
//                   key={stat.label}
//                   className={`min-w-[130px] pr-8 ${
//                     index !== 0 ? "border-l border-white/10 pl-8" : ""
//                   }`}
//                 >
//                   <p className="text-xs text-slate-400">{stat.label}</p>

//                   <p className="mt-2 text-lg font-semibold text-white">
//                     {stat.value}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* SHARE */}
//           <div className="absolute right-6 top-8 hidden gap-3 md:flex">
//             <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-purple-500/30">
//               <FaShareAlt />
//             </button>

//             <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-purple-500/30">
//               <FaEllipsisV />
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useMyProfile } from "@/hooks/use-my-profile";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaCopy,
  FaEllipsisV,
  FaGlobe,
  FaLink,
  FaShareAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si";
import ProfileEditModal from "./profileEdithModal";

const banner = "https://images.unsplash.com/photo-1519608487953-e999c86e7455";

function shortenWallet(wallet: string) {
  if (wallet.length <= 14) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export default function ProfileHero() {
  const { data: profile, isLoading, isError } = useMyProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyWallet = async () => {
    if (!profile?.wallet) return;

    try {
      await navigator.clipboard.writeText(profile.wallet);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const shareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  };

  if (isLoading) {
    return (
      <section className="animate-pulse border-b border-blue-500/10">
        <div className="mx-auto max-w-[1500px] px-6 py-20">
          <div className="h-8 w-64 rounded bg-white/10" />
          <div className="mt-5 h-4 w-80 rounded bg-white/5" />
          <div className="mt-8 h-20 w-full rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="border-b border-blue-500/10 px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-white">
          Unable to load profile
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Connect your wallet and verify your session, then try again.
        </p>
      </section>
    );
  }

  const displayName = profile.username
    ? `@${profile.username}`
    : shortenWallet(profile.wallet);

  return (
    <>
      <section className="relative overflow-hidden border-b border-blue-500/10">
        {/* Banner */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${banner}")` }}
          role="img"
          aria-label="Profile banner"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/80 to-[#020817]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/30" />

        <div className="relative mx-auto max-w-[1500px] px-6">
          <div className="flex min-h-[285px] items-center gap-7 py-8">
            {/* Desktop avatar */}
            <div className="hidden shrink-0 md:block">
              <div className="rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 p-[3px] shadow-[0_0_35px_rgba(168,85,247,0.3)]">
                <div className="flex h-[145px] w-[145px] items-center justify-center overflow-hidden rounded-full bg-[#020817] p-1">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={displayName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-cyan-300">
                      {(
                        profile.username?.[0] ?? profile.wallet[0]
                      ).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-[650px]">
                  {/* Mobile avatar */}
                  <div className="mb-5 md:hidden">
                    <div className="inline-flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 p-[3px]">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={displayName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#020817] text-3xl font-bold text-cyan-300">
                          {(
                            profile.username?.[0] ?? profile.wallet[0]
                          ).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="break-all text-3xl font-bold tracking-tight md:text-4xl">
                      {displayName}
                    </h1>

                    {/* Replace this with a real verification flag when implemented */}
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-[#020817]"
                      title="Wallet profile"
                    >
                      <FaCheck />
                    </span>
                  </div>

                  {/* Wallet */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <FaLink className="text-xs text-slate-500" />
                    <span>{shortenWallet(profile.wallet)}</span>

                    <button
                      type="button"
                      onClick={copyWallet}
                      aria-label="Copy wallet address"
                      className="text-slate-500 transition hover:text-cyan-400"
                    >
                      <FaCopy />
                    </button>

                    {copied && (
                      <span className="text-xs text-cyan-400">Copied!</span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="mt-4 max-w-[500px] whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {profile.bio || "This creator hasn't added a bio yet."}
                  </p>

                  {/* Social links */}
                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter profile"
                        className="text-slate-300 transition hover:text-white"
                      >
                        <FaXTwitter />
                      </a>
                    )}

                    {profile.discord && (
                      <a
                        href={profile.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Discord"
                        className="text-slate-300 transition hover:text-white"
                      >
                        <SiDiscord />
                      </a>
                    )}

                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-cyan-400 transition hover:text-cyan-300"
                      >
                        <FaGlobe />
                        <span className="max-w-48 truncate">
                          {profile.website.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    disabled
                    title="Follow functionality will be added later"
                    className="rounded-xl border border-purple-500/60 bg-black/20 px-4 py-3 text-sm font-semibold text-white opacity-70"
                  >
                    Follow
                  </button>

                  <button
                    type="button"
                    onClick={shareProfile}
                    aria-label="Copy profile link"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                  >
                    <FaShareAlt />
                  </button>

                  <button
                    type="button"
                    aria-label="More profile actions"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                  >
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              {/* Stats: connect these to indexed marketplace data later */}
              <div className="mt-7 flex flex-wrap items-center gap-y-5">
                {[
                  { label: "NFTs Owned", value: "—" },
                  { label: "Created", value: "—" },
                  { label: "Listed", value: "—" },
                  { label: "Volume Traded", value: "— SOL" },
                  { label: "Followers", value: "—" },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`min-w-[130px] pr-8 ${
                      index !== 0 ? "border-l border-white/10 pl-8" : ""
                    }`}
                  >
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-right share shortcut */}
            <div className="absolute right-6 top-8 hidden md:flex">
              <button
                type="button"
                onClick={shareProfile}
                aria-label="Share profile"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-purple-500/30"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      </section>

      {editOpen && <ProfileEditModal onClose={() => setEditOpen(false)} />}
    </>
  );
}
