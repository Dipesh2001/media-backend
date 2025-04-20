import { Request, Response } from "express";
import { Album } from "../models/album-model";
import { errorResponse, successResponse } from "../helper";
import fs from "fs";
import path from "path";
import { removeUploadedFile } from "../middleware/handleUploadError";

// 🎯 Create Album
export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { name, artists, genre, language, description, releaseDate } = req.body;

    if (!req.file) {
      return errorResponse(res, "Cover image is required", {});
    }
    const newAlbum = new Album({
      name,
      artists,
      genre,
      language,
      description,
      releaseDate,
      coverImage: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    const response = await newAlbum.save();
    const modifiedAlbum = await Album.findByIdWithArtists(String(response._id));

    successResponse(res, "Album created successfully", { album: modifiedAlbum });
  } catch (error) {
    removeUploadedFile(req);
    errorResponse(res, "Error creating album", {});
  }
};

// 📚 Get All Albums
export const getAllAlbums = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Album.countDocuments(query);

    const albums = await Album.find(query)
      .populate("artists", "name image")
      .skip((page - 1) * size)
      .limit(size)
      .sort({ [sortBy]: -1 });

    successResponse(res, "Albums fetched successfully", {
      albums,
      pagination: {
        page,
        size,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
    });
  } catch (error) {
    console.log({ error });
    errorResponse(res, "Error fetching albums", {});
  }
};

// 🔍 Get Album by ID
export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const album = await Album.findById(req.params.id).populate("artists", "name image");
    if (!album) return errorResponse(res, "Album not found", {});
    successResponse(res, "Album fetched successfully", { album });
  } catch (error) {
    console.log({ error })
    errorResponse(res, "Error fetching album", {});
  }
};

// ✏️ Update Album
export const updateAlbum = async (req: Request, res: Response) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return errorResponse(res, "Album not found", {});
    } else {
      const { name, artists, genre, language, description, releaseDate } = req.body;

      album.name = name;
      album.artists = artists;
      album.genre = genre;
      album.language = language;
      album.description = description;
      album.releaseDate = releaseDate;

      // 📸 Replace image if new uploaded
      if (req.file) {
        if (album.coverImage) {
          fs.unlink(path.join(album.coverImage), err => {
            if (err) console.log("Failed to delete old image:", err);
          });
        }
        album.coverImage = req.file.path.replace(/\\/g, "/");
      }

      const response = await album.save();
      const modifiedAlbum = await Album.findByIdWithArtists(String(response._id));

      successResponse(res, "Album updated successfully", { album: modifiedAlbum });
    }
  } catch (error) {
    removeUploadedFile(req);
    errorResponse(res, "Error updating album", {});
  }
};

// ❌ Delete Album
export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      errorResponse(res, "Album not found", {});
    } else {
      if (album.coverImage) {
        fs.unlink(path.join(album.coverImage), err => {
          if (err) console.log("Failed to delete image:", err);
        });
      }

      await album.deleteOne();
      successResponse(res, "Album deleted successfully");
    }
  } catch (error) {
    errorResponse(res, "Error deleting album", {});
  }
};

// ✅ Toggle Status
export const toggleAlbumStatus = async (req: Request, res: Response) => {
  try {
    const modifiedAlbum = await Album.findByIdWithArtists(String(req.params.id));

    if (!modifiedAlbum) {
      errorResponse(res, "Album not found", {});
    } else {
      modifiedAlbum.status = !modifiedAlbum.status;
      await modifiedAlbum.save();
      successResponse(res, "Album status updated successfully", { album: modifiedAlbum });
    }
  } catch (error) {
    errorResponse(res, "Error updating album status", {});
  }
};
