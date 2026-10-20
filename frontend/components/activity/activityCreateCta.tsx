import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function ActivityCreateCta() {
  return (
    <section className="relative min-h-[185px] overflow-hidden rounded-2xl border border-[#293b85] bg-gradient-to-br from-[#0d123c] via-[#071332] to-[#09052c] p-4">
      {/* glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#743cff]/30 blur-3xl" />

      <div className="relative z-10 max-w-[190px]">
        <h2 className="text-base font-semibold leading-tight text-white">
          Start creating
          <br />
          your own collection
        </h2>

        <p className="mt-2 text-[10px] leading-4 text-[#91a8d5]">
          Mint, sell and grow your brand on Solana.
        </p>

        <Link
          href="/create"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9a2fff] to-[#00d8ee] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:scale-[1.02]"
        >
          Create Collection
          <FiArrowRight />
        </Link>
      </div>

      <div className="absolute bottom-0 right-3 flex rotate-12 items-end gap-1 opacity-70">
        <div className="h-20 w-10 rotate-[-18deg] rounded-lg bg-gradient-to-br from-[#812eff] to-[#0dd8ee] blur-[1px]" />
        <div className="h-28 w-14 rotate-[10deg] rounded-lg bg-gradient-to-br from-[#c934ff] to-[#314cff] opacity-80" />
        <HiOutlineSparkles className="absolute -right-2 top-3 text-4xl text-[#b46aff]" />
      </div>
    </section>
  );
}
