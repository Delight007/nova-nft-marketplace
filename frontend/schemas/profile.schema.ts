import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().trim().url("Enter a valid URL"),
]);

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
