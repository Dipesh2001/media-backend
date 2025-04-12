import { z } from "zod";

export const createAlbumSchema = z.object({
  name: z.string().min(2, "Name is required"),
  genre: z.string().min(2, "Genre is required"),
  language: z.string().min(2, "Language is required"),
  description: z.string().optional(),
  releaseDate: z.string().min(1, "Release date is required"),
  artists: z.array(z.string().min(1)).min(1, "At least one artist is required"),
});

export const updateAlbumSchema = z.object({
  name: z.string().min(2, "Name is required"),
  genre: z.string().min(2, "Genre is required"),
  language: z.string().min(2, "Language is required"),
  description: z.string().optional(),
  releaseDate: z.string().min(1, "Release date is required"),
  artists: z.array(z.string().min(1)).min(1, "At least one artist is required"),
});
