"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAlbumStatus = exports.deleteAlbum = exports.updateAlbum = exports.getAlbumById = exports.getAllAlbums = exports.createAlbum = void 0;
const album_model_1 = require("../models/album-model");
const helper_1 = require("../helper");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleUploadError_1 = require("../middleware/handleUploadError");
// 🎯 Create Album
const createAlbum = async (req, res) => {
    try {
        const { name, artists, genre, language, description, releaseDate } = req.body;
        if (!req.file) {
            return (0, helper_1.errorResponse)(res, "Cover image is required", {});
        }
        const newAlbum = new album_model_1.Album({
            name,
            artists,
            genre,
            language,
            description,
            releaseDate,
            coverImage: req.file ? req.file.path.replace(/\\/g, "/") : "",
        });
        const response = await newAlbum.save();
        const modifiedAlbum = await album_model_1.Album.findByIdWithArtists(String(response._id));
        (0, helper_1.successResponse)(res, "Album created successfully", { album: modifiedAlbum });
    }
    catch (error) {
        (0, handleUploadError_1.removeUploadedFile)(req);
        (0, helper_1.errorResponse)(res, "Error creating album", {});
    }
};
exports.createAlbum = createAlbum;
// 📚 Get All Albums
const getAllAlbums = async (req, res) => {
    try {
        const albums = await album_model_1.Album.find().populate("artists", "name image");
        (0, helper_1.successResponse)(res, "Albums fetched successfully", { albums });
    }
    catch (error) {
        console.log({ error });
        (0, helper_1.errorResponse)(res, "Error fetching albums", {});
    }
};
exports.getAllAlbums = getAllAlbums;
// 🔍 Get Album by ID
const getAlbumById = async (req, res) => {
    try {
        const album = await album_model_1.Album.findById(req.params.id).populate("artists", "name image");
        if (!album)
            return (0, helper_1.errorResponse)(res, "Album not found", {});
        (0, helper_1.successResponse)(res, "Album fetched successfully", { album });
    }
    catch (error) {
        console.log({ error });
        (0, helper_1.errorResponse)(res, "Error fetching album", {});
    }
};
exports.getAlbumById = getAlbumById;
// ✏️ Update Album
const updateAlbum = async (req, res) => {
    try {
        const album = await album_model_1.Album.findById(req.params.id);
        if (!album) {
            return (0, helper_1.errorResponse)(res, "Album not found", {});
        }
        else {
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
                    fs_1.default.unlink(path_1.default.join(album.coverImage), err => {
                        if (err)
                            console.log("Failed to delete old image:", err);
                    });
                }
                album.coverImage = req.file.path.replace(/\\/g, "/");
            }
            const response = await album.save();
            const modifiedAlbum = await album_model_1.Album.findByIdWithArtists(String(response._id));
            (0, helper_1.successResponse)(res, "Album updated successfully", { album: modifiedAlbum });
        }
    }
    catch (error) {
        (0, handleUploadError_1.removeUploadedFile)(req);
        (0, helper_1.errorResponse)(res, "Error updating album", {});
    }
};
exports.updateAlbum = updateAlbum;
// ❌ Delete Album
const deleteAlbum = async (req, res) => {
    try {
        const album = await album_model_1.Album.findById(req.params.id);
        if (!album) {
            (0, helper_1.errorResponse)(res, "Album not found", {});
        }
        else {
            if (album.coverImage) {
                fs_1.default.unlink(path_1.default.join(album.coverImage), err => {
                    if (err)
                        console.log("Failed to delete image:", err);
                });
            }
            await album.deleteOne();
            (0, helper_1.successResponse)(res, "Album deleted successfully");
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error deleting album", {});
    }
};
exports.deleteAlbum = deleteAlbum;
// ✅ Toggle Status
const toggleAlbumStatus = async (req, res) => {
    try {
        const modifiedAlbum = await album_model_1.Album.findByIdWithArtists(String(req.params.id));
        if (!modifiedAlbum) {
            (0, helper_1.errorResponse)(res, "Album not found", {});
        }
        else {
            modifiedAlbum.status = !modifiedAlbum.status;
            await modifiedAlbum.save();
            (0, helper_1.successResponse)(res, "Album status updated successfully", { album: modifiedAlbum });
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error updating album status", {});
    }
};
exports.toggleAlbumStatus = toggleAlbumStatus;
