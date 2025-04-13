"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSongStatus = exports.deleteSong = exports.updateSong = exports.getSongById = exports.getAllSongs = exports.createSong = void 0;
const song_model_1 = require("../models/song-model");
const helper_1 = require("../helper");
const fs_1 = __importDefault(require("fs"));
const handleUploadError_1 = require("../middleware/handleUploadError");
const music_metadata_1 = require("music-metadata");
const album_model_1 = require("../models/album-model");
const createSong = async (req, res) => {
    try {
        const { name, album, artists } = req.body;
        if (artists && artists.length > 0) {
            const albumData = await album_model_1.Album.findByIdWithArtists(album.toString());
            if (albumData) {
                const albumArtistIds = (albumData.artists || []).map((art) => art._id.toString());
                const invalidArtists = artists.filter((artistId) => !albumArtistIds.includes(artistId.toString()));
                if (invalidArtists.length > 0) {
                    return (0, helper_1.errorResponse)(res, `Invalid artist(s) provided. They must be part of the album's artists.`, {});
                }
            }
        }
        if (!req.file)
            return (0, helper_1.errorResponse)(res, "Audio file is required", {});
        const newSong = new song_model_1.Song({
            name,
            album,
            audioFile: req.file.path.replace(/\\/g, "/"),
            duration: await getAudioDuration(req.file.path),
            artists: artists || []
        });
        const saved = await newSong.save();
        const populated = await song_model_1.Song.findById(saved._id).populate("album", "name image").populate("artists", "name image");
        (0, helper_1.successResponse)(res, "Song created successfully", { song: populated });
    }
    catch (error) {
        (0, handleUploadError_1.removeUploadedFile)(req);
        (0, helper_1.errorResponse)(res, "Error creating song", {});
    }
};
exports.createSong = createSong;
const getAllSongs = async (req, res) => {
    try {
        const songs = await song_model_1.Song.find().populate("album", "name image").populate("artists", "name image");
        (0, helper_1.successResponse)(res, "Songs fetched successfully", { songs });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error fetching songs", {});
    }
};
exports.getAllSongs = getAllSongs;
const getSongById = async (req, res) => {
    try {
        const song = await song_model_1.Song.findById(req.params.id).populate("album", "name image").populate("artists", "name image");
        if (!song)
            return (0, helper_1.errorResponse)(res, "Song not found", {});
        (0, helper_1.successResponse)(res, "Song fetched successfully", { song });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error fetching song", {});
    }
};
exports.getSongById = getSongById;
const updateSong = async (req, res) => {
    try {
        const { name, album, artists } = req.body;
        if (artists && artists.length > 0) {
            const albumData = await album_model_1.Album.findByIdWithArtists(album.toString());
            if (albumData) {
                const albumArtistIds = (albumData.artists || []).map((art) => art._id.toString());
                const invalidArtists = artists.filter((artistId) => !albumArtistIds.includes(artistId.toString()));
                if (invalidArtists.length > 0) {
                    return (0, helper_1.errorResponse)(res, `Invalid artist(s) provided. They must be part of the album's artists.`, {});
                }
            }
        }
        const song = await song_model_1.Song.findById(req.params.id);
        if (!song) {
            (0, handleUploadError_1.removeUploadedFile)(req);
            return (0, helper_1.errorResponse)(res, "Song not found", {});
        }
        if (req.file) {
            if (song.audioFile)
                fs_1.default.unlink(song.audioFile, () => { });
            song.audioFile = req.file.path.replace(/\\/g, "/");
        }
        song.name = name;
        song.album = album;
        song.artists = artists;
        await song.save();
        const updated = await song_model_1.Song.findById(song._id).populate("album", "name image").populate("artists", "name image");
        (0, helper_1.successResponse)(res, "Song updated successfully", { song: updated });
    }
    catch (error) {
        (0, handleUploadError_1.removeUploadedFile)(req);
        console.log({ error });
        (0, helper_1.errorResponse)(res, "Error updating song", {});
    }
};
exports.updateSong = updateSong;
const deleteSong = async (req, res) => {
    try {
        const song = await song_model_1.Song.findById(req.params.id);
        if (!song)
            return (0, helper_1.errorResponse)(res, "Song not found", {});
        if (song.audioFile)
            fs_1.default.unlink(song.audioFile, () => { });
        await song.deleteOne();
        (0, helper_1.successResponse)(res, "Song deleted successfully");
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error deleting song", {});
    }
};
exports.deleteSong = deleteSong;
const toggleSongStatus = async (req, res) => {
    try {
        const song = await song_model_1.Song.findById(req.params.id).populate("album", "name image").populate("artists", "name image");
        if (!song)
            return (0, helper_1.errorResponse)(res, "Song not found", {});
        song.status = !song.status;
        await song.save();
        (0, helper_1.successResponse)(res, "Song status updated successfully", { status: song });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error toggling status", {});
    }
};
exports.toggleSongStatus = toggleSongStatus;
const getAudioDuration = async (filePath) => {
    try {
        const metadata = await (0, music_metadata_1.parseFile)(filePath);
        return metadata.format.duration || null; // duration in seconds
    }
    catch (err) {
        console.error("Error getting audio duration:", err);
        return null;
    }
};
