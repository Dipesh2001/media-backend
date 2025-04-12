"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlbumSchema = exports.createAlbumSchema = void 0;
const zod_1 = require("zod");
exports.createAlbumSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    genre: zod_1.z.string().min(2, "Genre is required"),
    language: zod_1.z.string().min(2, "Language is required"),
    description: zod_1.z.string().optional(),
    releaseDate: zod_1.z.string().min(1, "Release date is required"),
    artists: zod_1.z.array(zod_1.z.string().min(1)).min(1, "At least one artist is required"),
});
exports.updateAlbumSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    genre: zod_1.z.string().min(2, "Genre is required"),
    language: zod_1.z.string().min(2, "Language is required"),
    description: zod_1.z.string().optional(),
    releaseDate: zod_1.z.string().min(1, "Release date is required"),
    artists: zod_1.z.array(zod_1.z.string().min(1)).min(1, "At least one artist is required"),
});
