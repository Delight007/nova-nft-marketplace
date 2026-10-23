"use client";

import { useForm } from "react-hook-form";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
const initialValues: ProfileFormValues = {
  username: "",
  bio: "",
  avatar: "",
  website: "",
  twitter: "",
  discord: "",
};

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  async function onSubmit(values: ProfileFormValues) {
    // Connect your existing profile API mutation here.
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...register("username")}
          placeholder="levi_nova"
          aria-invalid={!!errors.username}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#071226] p-3 text-white"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          {...register("bio")}
          maxLength={300}
          placeholder="Tell people about yourself"
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#071226] p-3 text-white"
        />
        <div className="mt-1 flex justify-between text-sm">
          {errors.bio ? (
            <p className="text-red-400">{errors.bio.message}</p>
          ) : (
            <span className="text-slate-400">Maximum 300 characters</span>
          )}
        </div>
      </div>

      {(["avatar", "website", "twitter", "discord"] as const).map((field) => (
        <div key={field}>
          <label htmlFor={field} className="capitalize">
            {field === "avatar" ? "Avatar image URL" : field}
          </label>
          <input
            id={field}
            {...register(field)}
            placeholder="https://..."
            aria-invalid={!!errors[field]}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#071226] p-3 text-white"
          />
          {errors[field] && (
            <p className="mt-1 text-sm text-red-400">{errors[field].message}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
