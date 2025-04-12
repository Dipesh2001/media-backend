import { z } from "zod";

// Reusable field schemas
const urlSchema = z.string().url("Invalid URL").optional();
const nameSchema = z.string().min(2, "Artist name must be at least 2 characters");

export const createArtistSchema = z.object({
  name: nameSchema,
  image: urlSchema,
  bio: z.string().optional(),
  country: z.string().optional(),
  socialLinks: z
    .object({
      youtube: urlSchema,
      instagram: urlSchema,
      twitter: urlSchema,
      facebook: urlSchema,
    })
    .optional(),
});

export const updateArtistSchema = z.object({
  name: nameSchema.optional(),
  image: urlSchema.optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  socialLinks: z
    .object({
      youtube: urlSchema,
      instagram: urlSchema,
      twitter: urlSchema,
      facebook: urlSchema,
    })
    .optional(),
});
