"use client";

import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiSun } from "react-icons/fi";

const navLinks = [
  { name: "Explore", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Activity", href: "/activity" },
  { name: "Create", href: "/create" },
];

export default function Navbar() {
  return (
    <section className="border-b border-white/10 bg-[#030712] container">
      <nav className=" mx-auto max-w-7xl z-10 px-4 lg:px-10 flex h-14 items-center">
        {/* Logo */}
        <Link
          href="/"
          className="relative mr-14 flex h-7 w-[140px] items-center overflow-hidden"
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
            <FiSearch className="mr-3 text-base text-slate-400" />

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

          {/* Connect Wallet */}
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Connect Wallet
          </button>
        </div>
      </nav>
    </section>
  );
}
