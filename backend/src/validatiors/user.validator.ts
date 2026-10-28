import { z } from "zod";

const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("Enter a valid URL")])
  .optional()
  .transform((value) => (value ? value : null));

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      )
      .optional(),

    avatar: optionalUrl,
    banner: optionalUrl,

    bio: z
      .string()
      .trim()
      .max(300, "Bio cannot exceed 300 characters")
      .nullable()
      .optional(),

    website: optionalUrl,
    twitter: optionalUrl,
    discord: optionalUrl,
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one profile field to update",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
