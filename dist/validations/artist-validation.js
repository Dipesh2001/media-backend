"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtistSchema = exports.createArtistSchema = void 0;
const zod_1 = require("zod");
// Reusable field schemas
const urlSchema = zod_1.z.string().url("Invalid URL").optional();
const nameSchema = zod_1.z.string().min(2, "Artist name must be at least 2 characters");
exports.createArtistSchema = zod_1.z.object({
    name: nameSchema,
    image: urlSchema,
    bio: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    socialLinks: zod_1.z
        .object({
        youtube: urlSchema,
        instagram: urlSchema,
        twitter: urlSchema,
        facebook: urlSchema,
    })
        .optional(),
});
exports.updateArtistSchema = zod_1.z.object({
    name: nameSchema.optional(),
    image: urlSchema.optional(),
    bio: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    socialLinks: zod_1.z
        .object({
        youtube: urlSchema,
        instagram: urlSchema,
        twitter: urlSchema,
        facebook: urlSchema,
    })
        .optional(),
});
