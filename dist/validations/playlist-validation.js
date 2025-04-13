"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylistSchema = exports.createPlaylistSchema = void 0;
const zod_1 = require("zod");
exports.createPlaylistSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Playlist name is required"),
    coverImage: zod_1.z.string().optional(),
    songs: zod_1.z.array(zod_1.z.string().min(1, "Song ID required")),
});
exports.updatePlaylistSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Playlist name is required").optional(),
    coverImage: zod_1.z.string().optional(),
    songs: zod_1.z.array(zod_1.z.string().min(1, "Song ID required")).optional(),
    status: zod_1.z.boolean().optional(),
});
