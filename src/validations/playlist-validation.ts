import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  coverImage: z.string().optional(),
  songs: z.array(z.string().min(1, "Song ID required")),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required").optional(),
  coverImage: z.string().optional(),
  songs: z.array(z.string().min(1, "Song ID required")).optional(),
  status: z.boolean().optional(),
});