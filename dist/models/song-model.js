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
exports.Song = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const songSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    album: { type: mongoose_1.Schema.Types.ObjectId, ref: "Album", required: true },
    artists: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Artist" }],
    audioFile: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String },
    status: { type: Boolean, default: true },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
}, { timestamps: true });
songSchema.method("toJSON", function () {
    const song = this.toObject();
    const baseUrl = process.env.BASE_URL || "http://localhost:8000";
    if (song.audioFile) {
        song.audioFile = `${baseUrl}/${song.audioFile.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
    }
    return song;
});
exports.Song = mongoose_1.default.model("Song", songSchema);
