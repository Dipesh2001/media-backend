"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementLikesCount = exports.togglePlayListStatus = exports.deletePlaylist = exports.updatePlaylist = exports.getPlaylistById = exports.getAllPlaylists = exports.createPlaylist = void 0;
const playlist_model_1 = __importDefault(require("../models/playlist-model"));
const helper_1 = require("../helper");
const song_model_1 = require("../models/song-model");
const createPlaylist = async (req, res) => {
    try {
        const { name, coverImage, songs } = req.body;
        // const createdBy = req.admin?.role === "user" ? "user" : "admin";
        // const user = createdBy === "user" ? req.admin?._id : undefined;
        // Fetch with typing
        const foundSongs = await song_model_1.Song.find({ _id: { $in: songs } });
        if (foundSongs.length !== songs.length) {
            const foundIds = foundSongs.map(song => song._id.toString());
            const missingIds = songs.filter((id) => !foundIds.includes(id));
            return (0, helper_1.errorResponse)(res, `Some song IDs do not exist: ${missingIds.join(", ")}`, {});
        }
        const playlist = await playlist_model_1.default.create({
            name,
            coverImage,
            songs,
            createdBy: "admin",
            // user,
        });
        const populated = await playlist_model_1.default.findById(playlist._id).populate({
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
        (0, helper_1.successResponse)(res, "Playlist created successfully", { playlist: populated });
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error creating playlist", err);
    }
};
exports.createPlaylist = createPlaylist;
const getAllPlaylists = async (_req, res) => {
    try {
        const playlists = await playlist_model_1.default.find().populate({
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
        (0, helper_1.successResponse)(res, "Playlists fetched", { playlists });
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error fetching playlists", err);
    }
};
exports.getAllPlaylists = getAllPlaylists;
const getPlaylistById = async (req, res) => {
    try {
        const playlist = await playlist_model_1.default.findById(req.params.id).populate({
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
        if (!playlist)
            return (0, helper_1.errorResponse)(res, "Playlist not found", {});
        (0, helper_1.successResponse)(res, "Playlist fetched", { playlist });
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error fetching playlist", err);
    }
};
exports.getPlaylistById = getPlaylistById;
const updatePlaylist = async (req, res) => {
    try {
        const { songs } = req.body;
        // Fetch with typing
        const foundSongs = await song_model_1.Song.find({ _id: { $in: songs } });
        if (foundSongs.length !== songs.length) {
            const foundIds = foundSongs.map(song => song._id.toString());
            const missingIds = songs.filter((id) => !foundIds.includes(id));
            return (0, helper_1.errorResponse)(res, `Some song IDs do not exist: ${missingIds.join(", ")}`, {});
        }
        const updated = await playlist_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
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
        if (!updated)
            return (0, helper_1.errorResponse)(res, "Playlist not found", {});
        (0, helper_1.successResponse)(res, "Playlist updated", { playlist: updated });
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error updating playlist", err);
    }
};
exports.updatePlaylist = updatePlaylist;
const deletePlaylist = async (req, res) => {
    try {
        const deleted = await playlist_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return (0, helper_1.errorResponse)(res, "Playlist not found", {});
        (0, helper_1.successResponse)(res, "Playlist deleted", {});
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error deleting playlist", err);
    }
};
exports.deletePlaylist = deletePlaylist;
const togglePlayListStatus = async (req, res) => {
    try {
        const playlist = await playlist_model_1.default.findById(req.params.id).populate({
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
        if (!playlist)
            return (0, helper_1.errorResponse)(res, "Playlist not found", {});
        playlist.status = !playlist.status;
        await playlist.save();
        (0, helper_1.successResponse)(res, "Playlist status updated successfully", { status: playlist });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error toggling playlist", {});
    }
};
exports.togglePlayListStatus = togglePlayListStatus;
const incrementLikesCount = async (req, res) => {
    try {
        // if (req.admin?.role !== "user") {
        //   return errorResponse(res, "Only users can like playlists", {});
        // }
        const playlist = await playlist_model_1.default.findById(req.params.id);
        if (!playlist)
            return (0, helper_1.errorResponse)(res, "Playlist not found", {});
        if (playlist.createdBy === "user") {
            playlist.likesCount = (playlist.likesCount || 0) + 1;
            await playlist.save();
        }
        (0, helper_1.successResponse)(res, "Playlist liked", { likes: playlist.likesCount });
    }
    catch (err) {
        (0, helper_1.errorResponse)(res, "Error liking playlist", err);
    }
};
exports.incrementLikesCount = incrementLikesCount;
