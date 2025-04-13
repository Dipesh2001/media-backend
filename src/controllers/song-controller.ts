import { Request, Response } from "express";
import { Song } from "../models/song-model";
import { errorResponse, successResponse } from "../helper";
import fs from "fs";
import { removeUploadedFile } from "../middleware/handleUploadError";
import { parseFile } from "music-metadata";
import { Album } from "../models/album-model";

export const createSong = async (req: Request, res: Response) => {
  try {
    const { name, album,artists } = req.body;
    if (artists && artists.length > 0) {
      const albumData = await Album.findByIdWithArtists(album.toString());
  
      if (albumData) {
        const albumArtistIds = (albumData.artists || []).map((art) => art._id.toString());

        const invalidArtists = artists.filter(
          (artistId:string) => !albumArtistIds.includes(artistId.toString())
        );
    
        if (invalidArtists.length > 0) {
          return errorResponse(res, `Invalid artist(s) provided. They must be part of the album's artists.`, {});
        }
      }
    }

    if (!req.file) return errorResponse(res, "Audio file is required", {});
    
    const newSong = new Song({
      name,
      album,
      audioFile: req.file.path.replace(/\\/g, "/"),
      duration: await getAudioDuration(req.file.path),
      artists:artists || []
    });
    
    const saved = await newSong.save();
    const populated = await Song.findById(saved._id).populate("album","name image").populate("artists","name image");

    successResponse(res, "Song created successfully", { song: populated });
  } catch (error) {
    removeUploadedFile(req);
    errorResponse(res, "Error creating song", {});
  }
};

export const getAllSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.find().populate("album","name image").populate("artists","name image");
    successResponse(res, "Songs fetched successfully", { songs });
  } catch (error) {
    errorResponse(res, "Error fetching songs", {});
  }
};

export const getSongById = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id).populate("album","name image").populate("artists","name image");
    if (!song) return errorResponse(res, "Song not found", {});
    successResponse(res, "Song fetched successfully", { song });
  } catch (error) {
    errorResponse(res, "Error fetching song", {});
  }
};

export const updateSong = async (req: Request, res: Response) => {
  try {
    const { name, album,artists } = req.body;

    if (artists && artists.length > 0) {
      const albumData = await Album.findByIdWithArtists(album.toString());
  
      if (albumData) {
        const albumArtistIds = (albumData.artists || []).map((art) => art._id.toString());

        const invalidArtists = artists.filter(
          (artistId:string) => !albumArtistIds.includes(artistId.toString())
        );
    
        if (invalidArtists.length > 0) {
          return errorResponse(res, `Invalid artist(s) provided. They must be part of the album's artists.`, {});
        }
      }
    }
    const song = await Song.findById(req.params.id);

    if (!song) {
      removeUploadedFile(req);
      return errorResponse(res, "Song not found", {});
    }

    if (req.file) {
      if (song.audioFile) fs.unlink(song.audioFile, () => {});

      song.audioFile = req.file.path.replace(/\\/g, "/");
    }

    song.name = name;
    song.album = album;
    song.artists = artists

    await song.save();
    const updated = await Song.findById(song._id).populate("album","name image").populate("artists","name image");

    successResponse(res, "Song updated successfully", { song: updated });
  } catch (error) {
    removeUploadedFile(req);
    console.log({error});
    errorResponse(res, "Error updating song", {});
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return errorResponse(res, "Song not found", {});

    if (song.audioFile) fs.unlink(song.audioFile, () => {});
    await song.deleteOne();

    successResponse(res, "Song deleted successfully");
  } catch (error) {
    errorResponse(res, "Error deleting song", {});
  }
};

export const toggleSongStatus = async (req: Request, res: Response) => {
  try {
    const song = await Song.findById(req.params.id).populate("album","name image").populate("artists","name image");
    if (!song) return errorResponse(res, "Song not found", {});
    song.status = !song.status;
    await song.save();
    successResponse(res, "Song status updated successfully", { status: song });
  } catch (error) {
    errorResponse(res, "Error toggling status", {});
  }
};

const getAudioDuration = async (filePath: string): Promise<number | null> => {
  try {
    const metadata = await parseFile(filePath);
    return metadata.format.duration || null; // duration in seconds
  } catch (err) {
    console.error("Error getting audio duration:", err);
    return null;
  }
};
