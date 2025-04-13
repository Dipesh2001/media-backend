import { Request, Response } from "express";
import Playlist from "../models/playlist-model";
import { successResponse, errorResponse } from "../helper";
import { authRequest } from "../middleware/auth";
import { ISong, Song } from "../models/song-model";
import { Types } from "mongoose";

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { name, coverImage, songs } = req.body;
    // const createdBy = req.admin?.role === "user" ? "user" : "admin";
    // const user = createdBy === "user" ? req.admin?._id : undefined;

    // Fetch with typing
    const foundSongs = await Song.find({ _id: { $in: songs } }) as (ISong & { _id: Types.ObjectId })[];

    if (foundSongs.length !== songs.length) {
      const foundIds = foundSongs.map(song => song._id.toString());
      const missingIds = songs.filter((id: string) => !foundIds.includes(id));
      return errorResponse(res, `Some song IDs do not exist: ${missingIds.join(", ")}`, {});
    }

    const playlist = await Playlist.create({
      name,
      coverImage,
      songs,
      createdBy: "admin",
      // user,
    });

    const populated = await Playlist.findById(playlist._id).populate({
      path: "songs",
      populate: [
        {
          path: "album",
          select: "name coverImage",
        },
        {
          path: "artists",
          select: "name image",
        },
      ],
      select: "name audioFile album artists", // fields from Song model
    });
    successResponse(res, "Playlist created successfully", { playlist: populated });
  } catch (err) {
    errorResponse(res, "Error creating playlist", err);
  }
};

export const getAllPlaylists = async (_req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find().populate({
      path: "songs",
      populate: [
        {
          path: "album",
          select: "name coverImage", // Get album name and cover
          populate: {
            path: "artists",
            select: "name image", // or other fields
          },
        },
        {
          path: "artists", // in case song has direct artists field
          select: "name image",
        },
      ],
      select: "name audioFile album artists", // fields from Song model
    });
    successResponse(res, "Playlists fetched", { playlists });
  } catch (err) {
    errorResponse(res, "Error fetching playlists", err);
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate({
      path: "songs",
      populate: [
        {
          path: "album",
          select: "name coverImage",
        },
        {
          path: "artists",
          select: "name image",
        },
      ],
      select: "name audioFile album artists", // fields from Song model
    });
    if (!playlist) return errorResponse(res, "Playlist not found", {});
    successResponse(res, "Playlist fetched", { playlist });
  } catch (err) {
    errorResponse(res, "Error fetching playlist", err);
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { songs } = req.body;
    // Fetch with typing
    const foundSongs = await Song.find({ _id: { $in: songs } }) as (ISong & { _id: Types.ObjectId })[];

    if (foundSongs.length !== songs.length) {
      const foundIds = foundSongs.map(song => song._id.toString());
      const missingIds = songs.filter((id: string) => !foundIds.includes(id));
      return errorResponse(res, `Some song IDs do not exist: ${missingIds.join(", ")}`, {});
    }
    const updated = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
      path: "songs",
      populate: [
        {
          path: "album",
          select: "name coverImage",
        },
        {
          path: "artists",
          select: "name image",
        },
      ],
      select: "name audioFile album artists", // fields from Song model
    });
    if (!updated) return errorResponse(res, "Playlist not found", {});
    successResponse(res, "Playlist updated", { playlist: updated });
  } catch (err) {
    errorResponse(res, "Error updating playlist", err);
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const deleted = await Playlist.findByIdAndDelete(req.params.id);
    if (!deleted) return errorResponse(res, "Playlist not found", {});
    successResponse(res, "Playlist deleted", {});
  } catch (err) {
    errorResponse(res, "Error deleting playlist", err);
  }
};

export const togglePlayListStatus = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate({
      path: "songs",
      populate: [
        {
          path: "album",
          select: "name coverImage",
        },
        {
          path: "artists",
          select: "name image",
        },
      ],
      select: "name audioFile album artists", // fields from Song model
    });
    if (!playlist) return errorResponse(res, "Playlist not found", {});
    playlist.status = !playlist.status;
    await playlist.save();
    successResponse(res, "Playlist status updated successfully", { status: playlist });
  } catch (error) {
    errorResponse(res, "Error toggling playlist", {});
  }
};

export const incrementLikesCount = async (req: authRequest, res: Response) => {
  try {
    // if (req.admin?.role !== "user") {
    //   return errorResponse(res, "Only users can like playlists", {});
    // }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return errorResponse(res, "Playlist not found", {});

    if (playlist.createdBy === "user") {
      playlist.likesCount = (playlist.likesCount || 0) + 1;
      await playlist.save();
    }

    successResponse(res, "Playlist liked", { likes: playlist.likesCount });
  } catch (err) {
    errorResponse(res, "Error liking playlist", err);
  }
};
