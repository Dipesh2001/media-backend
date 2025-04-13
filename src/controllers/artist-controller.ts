import { Request, Response } from "express";
import { Artist, IArtist } from "../models/artist-model";
import { errorResponse, formatImagePath, successResponse } from "../helper";
import fs from "fs";
import { removeUploadedFile } from "../middleware/handleUploadError";

// ➕ Create Artist
export const createArtist = async (req: Request, res: Response) => {
  try {
    const { name, bio, country, socialLinks } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const existingArtist = await Artist.findOne({ name });
    if (existingArtist) {
      errorResponse(res, "Artist already exists", {
        field: "name",
        message: "Artist with this name already exists",
      });
    }

    const newArtist = new Artist({
      name,
      image,
      bio,
      country,
      socialLinks,
    });

    await newArtist.save();
    successResponse(res, "Artist created successfully", { artist: newArtist });
  } catch (error) {
    removeUploadedFile(req);
    errorResponse(res, "Error creating artist", {});
  }
};

// 📃 Get All Artists
export const getAllArtists = async (_req: Request, res: Response) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    successResponse(res, "Artists fetched successfully", { artists });
  } catch (error) {
    errorResponse(res, "Error fetching artists", {});
  }
};

// 📄 Get Artist by ID
export const getArtistById = async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      errorResponse(res, "Artist not found", {});
    }
    successResponse(res, "Artist fetched successfully", { artist });
  } catch (error) {
    errorResponse(res, "Error fetching artist", {});
  }
};

// 📝 Update Artist
export const updateArtist = async (req: Request, res: Response) => {
  try {
    const { name, bio, country, socialLinks } = req.body;
    const artistId = req.params.id;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      errorResponse(res, "Artist not found", {});
      return;
    }else{
         // If a new image is uploaded, replace the old one
    if (req.file) {
      if (artist.image && fs.existsSync(artist.image)) {
        fs.unlink(artist.image, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      artist.image = req.file.path.replace(/\\/g, "/"); // Normalize path
    }

    artist.name = name || artist.name;
    artist.bio = bio || artist.bio;
    artist.country = country || artist.country;
    artist.socialLinks = socialLinks ? JSON.parse(socialLinks) : artist.socialLinks;

    await artist.save();
    }
    successResponse(res, "Artist updated successfully", { artist });
  } catch (error) {
    removeUploadedFile(req);
    errorResponse(res, "Failed to update artist", {});
  }
};

// ❌ Delete Artist
export const deleteArtist = async (req: Request, res: Response) => {
  try {
    const deleted = await Artist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      errorResponse(res, "Artist not found", {});
    }else{
      if (deleted.image && fs.existsSync(deleted.image)) {
        fs.unlink(deleted.image, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }
      successResponse(res, "Artist deleted successfully");
    }
  } catch (error) {
    errorResponse(res, "Error deleting artist", {});
  }
};

// 🔁 Toggle Active Status
export const toggleArtistStatus = async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      errorResponse(res, "Artist not found", {});
    }else{
      artist.isActive = !artist.isActive;
      await artist.save();
  
      successResponse(res, "Artist status updated", {
        artistId: artist._id,
        isActive: artist.isActive,
      });
    }
  } catch (error) {
    errorResponse(res, "Error toggling artist status", {});
  }
};