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
exports.Album = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AlbumSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    coverImage: { type: String, required: false },
    artists: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Artist", required: false }], // 👈 modified
    genre: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String },
    releaseDate: { type: Date, required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });
// Automatically format the coverImage to full URL
AlbumSchema.method("toJSON", function () {
    const album = this.toObject();
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    if (album.coverImage) {
        album.coverImage = `${baseUrl}/${album.coverImage.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
    }
    return album;
});
AlbumSchema.statics.findByIdWithArtists = function (id) {
    return this.findById(id).populate("artists", "name image");
};
exports.Album = mongoose_1.default.model("Album", AlbumSchema);
