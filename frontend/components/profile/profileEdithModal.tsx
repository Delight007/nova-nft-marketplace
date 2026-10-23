"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCamera,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaExternalLinkAlt,
  FaGlobe,
  FaImage,
  FaInfoCircle,
  FaSave,
  FaTimes,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si";

import { useMyProfile, useUpdateMyProfile } from "@/hooks/use-my-profile";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/profile.schema";
import { getProfileErrorMessage } from "@/services/user";

type Props = {
  onClose: () => void;
};

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455";

const fields = [
  {
    name: "website",
    label: "Website",
    placeholder: "https://yourwebsite.com",
    icon: FaGlobe,
  },
  {
    name: "twitter",
    label: "Twitter / X",
    placeholder: "https://x.com/yourusername",
    icon: FaXTwitter,
  },
  {
    name: "discord",
    label: "Discord",
    placeholder: "https://discord.gg/yourinvite",
    icon: SiDiscord,
  },
] as const;

function shortenWallet(wallet: string) {
  return wallet.length > 14
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : wallet;
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#080f20]/80 p-3 transition hover:border-purple-500/30">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-sm ${accent}`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

export default function ProfileEditModal({ onClose }: Props) {
  const { data: profile } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const [bannerPreview, setBannerPreview] = useState(DEFAULT_BANNER);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      bio: "",
      avatar: "",
      website: "",
      twitter: "",
      discord: "",
    },
  });

  const avatar = watch("avatar") ?? "";
  const bio = watch("bio") ?? "";

  useEffect(() => {
    if (!profile) return;

    reset({
      username: profile.username ?? "",
      bio: profile.bio ?? "",
      avatar: profile.avatar ?? "",
      website: profile.website ?? "",
      twitter: profile.twitter ?? "",
      discord: profile.discord ?? "",
    });
  }, [profile, reset]);

  const copyWallet = async () => {
    if (!profile?.wallet) return;

    try {
      await navigator.clipboard.writeText(profile.wallet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync({
        username: values.username,
        bio: values.bio,
        avatar: values.avatar,
        website: values.website,
        twitter: values.twitter,
        discord: values.discord,
      });

      onClose();
    } catch {
      // Mutation errors are displayed in the form.
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/[0.09] bg-[#080e1d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/10";

  const errorClass = "mt-1.5 text-xs text-red-400";

  const stats = [
    {
      label: "NFTs Owned",
      value: "—",
      icon: <FaWallet />,
      accent: "bg-purple-500/15 text-purple-400",
    },
    {
      label: "Created",
      value: "—",
      icon: <FaImage />,
      accent: "bg-emerald-500/15 text-emerald-400",
    },
    {
      label: "Listed",
      value: "—",
      icon: <FaChartBar />,
      accent: "bg-blue-500/15 text-blue-400",
    },
    {
      label: "Volume Traded",
      value: "— SOL",
      icon: <span className="font-bold">◎</span>,
      accent: "bg-amber-500/15 text-amber-400",
    },
    {
      label: "Followers",
      value: "—",
      icon: <FaUser />,
      accent: "bg-fuchsia-500/15 text-fuchsia-400",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#01040c]/85 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative my-auto max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-purple-500/20 bg-[#050b18] shadow-[0_0_80px_rgba(79,70,229,0.12)]"
      >
        {/* Top glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-cyan-400" />

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#050b18]/95 px-5 py-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-400/10 text-lg text-purple-400">
              <FaUser />
            </div>

            <div>
              <h2
                id="edit-profile-title"
                className="text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                Edit Profile
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Customize your identity in the NOVA universe.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit profile"
            className="rounded-xl border border-white/[0.08] p-2.5 text-slate-400 transition hover:border-purple-500/30 hover:bg-white/5 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 gap-0 lg:grid-cols-[0.92fr_1.08fr]"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-6 border-b border-white/[0.07] p-5 sm:p-8 lg:border-b-0 lg:border-r">
            {/* Banner editor */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Profile Appearance
                </h3>
                <span className="text-[11px] text-slate-500">
                  Customize your look
                </span>
              </div>

              <div className="group relative h-32 overflow-hidden rounded-xl border border-white/10 bg-[#080e1d] sm:h-36">
                <img
                  src={bannerPreview}
                  alt="Profile banner preview"
                  className="h-full w-full object-cover"
                  onError={() => setBannerPreview(DEFAULT_BANNER)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/80 to-transparent" />

                <div className="absolute bottom-3 right-3 left-3">
                  <label
                    htmlFor="banner-url"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-purple-400/50"
                  >
                    <FaCamera className="text-purple-300" />
                    Set banner URL
                  </label>
                  <input
                    id="banner-url"
                    type="url"
                    placeholder="Paste a banner image URL"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-400 focus:border-purple-500"
                    value={bannerPreview}
                    onChange={(event) => setBannerPreview(event.target.value)}
                    onBlur={() => {
                      if (!bannerPreview.trim()) {
                        setBannerPreview(DEFAULT_BANNER);
                      }
                    }}
                  />
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Banner preview only. Saving a banner requires a banner field in
                your User model and profile API.
              </p>
            </div>

            {/* Avatar editor */}
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#080e1d]/70 p-4 sm:gap-5">
              <div className="relative h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 p-[3px] shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <div className="h-full w-full overflow-hidden rounded-full bg-[#050b18] p-1">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="h-full w-full rounded-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-500/10 text-3xl font-bold text-purple-300">
                      {(
                        profile?.username?.[0] ??
                        profile?.wallet?.[0] ??
                        "N"
                      ).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#050b18] bg-purple-500 text-xs text-white">
                  <FaCamera />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white">
                  Profile Avatar
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Use an image URL for your public profile picture.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Recommended: square image
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FaChartBar className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Profile Statistics
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    accent={stat.accent}
                  />
                ))}
              </div>

              <div className="mt-4 flex gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
                <FaInfoCircle className="mt-0.5 shrink-0 text-cyan-400" />
                <p className="text-xs leading-5 text-slate-400">
                  Statistics should be calculated from your marketplace data and
                  will update automatically once the stats endpoint is
                  connected.
                </p>
              </div>
            </div>

            {/* Wallet */}
            {profile?.wallet && (
              <div className="rounded-xl border border-white/[0.07] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <FaWallet className="text-cyan-400" />
                  Connected Wallet
                </div>

                <div className="flex items-center justify-between gap-3">
                  <code className="truncate text-xs text-slate-400">
                    {shortenWallet(profile.wallet)}
                  </code>

                  <button
                    type="button"
                    onClick={copyWallet}
                    className="shrink-0 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    <FaCopy className="inline" /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-7 p-5 sm:p-8">
            {/* Profile details */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <FaUser className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Profile Details
                </h3>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-slate-200"
                  >
                    Username <span className="text-purple-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {watch("username")?.length ?? 0}/20
                  </span>
                </div>

                <input
                  id="username"
                  {...register("username")}
                  maxLength={20}
                  placeholder="your_username"
                  autoComplete="username"
                  aria-invalid={!!errors.username}
                  className={inputClass}
                />

                {errors.username && (
                  <p className={errorClass}>{errors.username.message}</p>
                )}

                <p className="mt-1.5 text-[11px] text-slate-500">
                  3–20 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-slate-200"
                  >
                    Bio
                  </label>
                  <span className="text-xs text-slate-500">
                    {bio.length}/300
                  </span>
                </div>

                <textarea
                  id="bio"
                  {...register("bio")}
                  rows={4}
                  maxLength={300}
                  placeholder="Tell the NOVA community about yourself..."
                  aria-invalid={!!errors.bio}
                  className={`${inputClass} resize-y`}
                />

                {errors.bio && (
                  <p className={errorClass}>{errors.bio.message}</p>
                )}
              </div>
            </section>

            {/* Social links */}
            <section>
              <div className="mb-5 flex items-center gap-2">
                <FaExternalLinkAlt className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  Social Links
                </h3>
              </div>

              <div className="space-y-4">
                {fields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium text-slate-200"
                      >
                        {field.label}
                      </label>

                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                          id={field.name}
                          type="url"
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          aria-invalid={!!errors[field.name]}
                          className={`${inputClass} pl-10`}
                        />
                      </div>

                      {errors[field.name] && (
                        <p className={errorClass}>
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Advanced settings */}
            <section className="border-y border-white/[0.07]">
              <button
                type="button"
                onClick={() => setShowAdvanced((current) => !current)}
                aria-expanded={showAdvanced}
                className="flex w-full items-center justify-between py-4 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <FaGlobe className="text-purple-400" />
                  Advanced Settings
                </span>
                {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {showAdvanced && (
                <div className="space-y-3 pb-5">
                  <div className="rounded-xl bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-white">
                      Public profile
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your username, bio, avatar, and social links may be
                      visible to visitors. Your wallet address remains public on
                      Solana.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] p-4">
                    <p className="text-sm font-medium text-white">
                      Username changes
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Usernames must be unique. If someone already owns your
                      chosen username, the backend will reject the update.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Error message */}
            {updateProfile.isError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm text-red-300"
              >
                {getProfileErrorMessage(updateProfile.error)}
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || updateProfile.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaSave />
                {isSubmitting || updateProfile.isPending
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
