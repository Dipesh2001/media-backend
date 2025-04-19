"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playlistSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    coverImage: { type: String },
    songs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Song", required: true }],
    createdBy: { type: String, enum: ["admin", "user"], required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    likesCount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
}, { timestamps: true });
// Optional: Hide likesCount if not a user-created playlist
playlistSchema.methods.toJSON = function () {
    const obj = this.toObject();
    if (obj.createdBy !== "user") {
        delete obj.likesCount;
    }
    return obj;
};
const Playlist = (0, mongoose_1.model)("Playlist", playlistSchema);
exports.default = Playlist;
