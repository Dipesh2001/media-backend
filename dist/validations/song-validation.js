"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSongSchema = exports.createSongSchema = void 0;
const zod_1 = require("zod");
exports.createSongSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Song name is required"),
    album: zod_1.z.string().min(1, "Album ID is required"),
    artists: zod_1.z.array(zod_1.z.string()).optional()
});
exports.updateSongSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Song name is required"),
    album: zod_1.z.string().min(1, "Album ID is required"),
    artists: zod_1.z.array(zod_1.z.string()).optional()
});
