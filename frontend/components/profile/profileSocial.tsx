"use client";

import { FaLink } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si";

export default function ProfileSocials() {
  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126] p-5">
      <h3 className="text-sm font-semibold">Socials</h3>

      <div className="mt-5 flex items-center gap-6">
        <a
          href="#"
          className="text-lg text-slate-400 transition hover:text-white"
        >
          <FaXTwitter />
        </a>

        <a
          href="#"
          className="text-lg text-slate-400 transition hover:text-white"
        >
          <SiDiscord />
        </a>

        <a
          href="#"
          className="text-lg text-slate-400 transition hover:text-white"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 text-[9px]">
            ◎
          </span>
        </a>

        <a
          href="#"
          className="text-lg text-slate-400 transition hover:text-white"
        >
          <FaLink />
        </a>
      </div>
    </section>
  );
}
