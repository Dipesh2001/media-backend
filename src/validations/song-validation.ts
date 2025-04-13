import { z } from "zod";

export const createSongSchema = z.object({
  name: z.string().min(1, "Song name is required"),
  album: z.string().min(1, "Album ID is required"),
  artists:z.array(z.string()).optional()
});

export const updateSongSchema = z.object({
  name: z.string().min(1, "Song name is required"),
  album: z.string().min(1, "Album ID is required"),
  artists:z.array(z.string()).optional()
});
