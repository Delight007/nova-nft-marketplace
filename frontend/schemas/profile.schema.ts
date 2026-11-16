import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "URL must use HTTP or HTTPS");

const optionalUrl = z.union([z.literal(""), httpUrl]);

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers, and underscores"),

  bio: z.string().max(300, "Bio cannot exceed 300 characters"),

  avatar: optionalUrl,
  website: optionalUrl,
  twitter: optionalUrl,
  discord: optionalUrl,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
