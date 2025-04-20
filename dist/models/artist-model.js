"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artist = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define Schema
const ArtistSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String },
    bio: { type: String },
    country: { type: String },
    socialLinks: {
        youtube: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        facebook: { type: String },
    },
    followers: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
ArtistSchema.method("toJSON", function () {
    const artist = this.toObject();
    const baseUrl = process.env.BASE_URL || "http://localhost:8000";
    if (artist.image && artist.image.startsWith("uploads")) {
        // Convert local image path to full URL
        artist.image = `${baseUrl}/${artist.image.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
    }
    return artist;
});
// Export model
exports.Artist = mongoose_1.default.model("Artist", ArtistSchema);
