"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleArtistStatus = exports.deleteArtist = exports.updateArtist = exports.getArtistById = exports.getAllArtists = exports.createArtist = void 0;
const artist_model_1 = require("../models/artist-model");
const helper_1 = require("../helper");
const fs_1 = __importDefault(require("fs"));
// ➕ Create Artist
const createArtist = async (req, res) => {
    try {
        const { name, bio, country, socialLinks } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, "/") : "";
        const existingArtist = await artist_model_1.Artist.findOne({ name });
        if (existingArtist) {
            (0, helper_1.errorResponse)(res, "Artist already exists", {
                field: "name",
                message: "Artist with this name already exists",
            });
        }
        const newArtist = new artist_model_1.Artist({
            name,
            image,
            bio,
            country,
            socialLinks,
        });
        await newArtist.save();
        (0, helper_1.successResponse)(res, "Artist created successfully", { artist: newArtist });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error creating artist", {});
    }
};
exports.createArtist = createArtist;
// 📃 Get All Artists
const getAllArtists = async (_req, res) => {
    try {
        const artists = await artist_model_1.Artist.find().sort({ createdAt: -1 });
        (0, helper_1.successResponse)(res, "Artists fetched successfully", { artists });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error fetching artists", {});
    }
};
exports.getAllArtists = getAllArtists;
// 📄 Get Artist by ID
const getArtistById = async (req, res) => {
    try {
        const artist = await artist_model_1.Artist.findById(req.params.id);
        if (!artist) {
            (0, helper_1.errorResponse)(res, "Artist not found", {});
        }
        (0, helper_1.successResponse)(res, "Artist fetched successfully", { artist });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error fetching artist", {});
    }
};
exports.getArtistById = getArtistById;
// 📝 Update Artist
const updateArtist = async (req, res) => {
    try {
        const { name, bio, country, socialLinks } = req.body;
        const artistId = req.params.id;
        const artist = await artist_model_1.Artist.findById(artistId);
        if (!artist) {
            return (0, helper_1.errorResponse)(res, "Artist not found", {});
        }
        else {
            // If a new image is uploaded, replace the old one
            if (req.file) {
                if (artist.image && fs_1.default.existsSync(artist.image)) {
                    fs_1.default.unlink(artist.image, (err) => {
                        if (err)
                            console.error("Error deleting old image:", err);
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
        (0, helper_1.successResponse)(res, "Artist updated successfully", { artist });
    }
    catch (error) {
        console.log({ error });
        (0, helper_1.errorResponse)(res, "Failed to update artist", {});
    }
};
exports.updateArtist = updateArtist;
// ❌ Delete Artist
const deleteArtist = async (req, res) => {
    try {
        const deleted = await artist_model_1.Artist.findByIdAndDelete(req.params.id);
        if (!deleted) {
            (0, helper_1.errorResponse)(res, "Artist not found", {});
        }
        else {
            if (deleted.image && fs_1.default.existsSync(deleted.image)) {
                fs_1.default.unlink(deleted.image, (err) => {
                    if (err)
                        console.error("Error deleting image:", err);
                });
            }
            (0, helper_1.successResponse)(res, "Artist deleted successfully");
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error deleting artist", {});
    }
};
exports.deleteArtist = deleteArtist;
// 🔁 Toggle Active Status
const toggleArtistStatus = async (req, res) => {
    try {
        const artist = await artist_model_1.Artist.findById(req.params.id);
        if (!artist) {
            (0, helper_1.errorResponse)(res, "Artist not found", {});
        }
        else {
            artist.isActive = !artist.isActive;
            await artist.save();
            (0, helper_1.successResponse)(res, "Artist status updated", {
                artistId: artist._id,
                isActive: artist.isActive,
            });
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error toggling artist status", {});
    }
};
exports.toggleArtistStatus = toggleArtistStatus;
