"use client";

import Image from "next/image";
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

const creator = {
  name: "NeonCreator",
  username: "@NeonCreator",
  wallet: "8xF3...9a2K",
  bio: "Digital artist & creator of Neon Realms. Exploring the intersection of technology, art and imagination. Building a more colorful future on Solana.",
  avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  banner: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
  website: "neoncreator.xyz",
};

const stats = [
  {
    label: "NFTs Owned",
    value: "24",
  },
  {
    label: "Created",
    value: "12",
  },
  {
    label: "Listed",
    value: "6",
  },
  {
    label: "Volume Traded",
    value: "523.4 SOL",
  },
  {
    label: "Followers",
    value: "8.7K",
  },
];

export default function ProfileHero() {
  const copyWallet = async () => {
    await navigator.clipboard.writeText("8xF3...9a2K");
  };

  return (
    <section className="relative overflow-hidden border-b border-blue-500/10">
      {/* BANNER */}
      <div className="absolute inset-0">
        <Image
          src={creator.banner}
          alt="Creator banner"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/80 to-[#020817]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/30" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6">
        <div className="flex min-h-[285px] items-center gap-7 py-8 lg:min-h-[285px]">
          {/* AVATAR */}
          <div className="relative hidden shrink-0 md:block">
            <div className="rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 p-[3px] shadow-[0_0_35px_rgba(168,85,247,0.3)]">
              <div className="rounded-full bg-[#020817] p-1">
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  width={145}
                  height={145}
                  className="h-[135px] w-[135px] rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* PROFILE CONTENT */}
          <div className="flex-1">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-[650px]">
                {/* MOBILE AVATAR */}
                <div className="mb-5 md:hidden">
                  <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 p-[3px]">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={100}
                      height={100}
                      className="h-[94px] w-[94px] rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {creator.username}
                  </h1>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs text-[#020817]">
                    <FaCheck />
                  </span>
                </div>

                {/* WALLET */}
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <FaLink className="text-xs text-slate-500" />

                  <span>{creator.wallet}</span>

                  <button
                    type="button"
                    onClick={copyWallet}
                    className="text-slate-500 transition hover:text-cyan-400"
                  >
                    <FaCopy />
                  </button>
                </div>

                {/* BIO */}
                <p className="mt-4 max-w-[620px] text-sm leading-6 text-slate-300">
                  {creator.bio}
                </p>

                {/* SOCIALS */}
                <div className="mt-5 flex items-center gap-5">
                  <a
                    href="#"
                    className="text-slate-300 transition hover:text-white"
                  >
                    <FaXTwitter />
                  </a>

                  <a
                    href="#"
                    className="text-slate-300 transition hover:text-white"
                  >
                    <SiDiscord />
                  </a>

                  <a
                    href="#"
                    className="text-slate-300 transition hover:text-white"
                  >
                    <FaGlobe />
                  </a>

                  <a
                    href="#"
                    className="text-sm text-cyan-400 transition hover:text-cyan-300"
                  >
                    {creator.website}
                  </a>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                <button className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                  Edit Profile
                </button>

                <button className="rounded-xl border border-purple-500/60 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500/10">
                  Follow
                </button>

                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-300 transition hover:border-purple-500/40 hover:text-white">
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-7 flex flex-wrap items-center gap-y-5">
              {stats.map((stat, index) => (
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

          {/* SHARE */}
          <div className="absolute right-6 top-8 hidden gap-3 md:flex">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-purple-500/30">
              <FaShareAlt />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-purple-500/30">
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
