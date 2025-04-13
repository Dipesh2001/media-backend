import mongoose, { Schema, Document, model } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  coverImage?: string;
  songs: mongoose.Types.ObjectId[];
  createdBy: "admin" | "user";
  user?: mongoose.Types.ObjectId;
  likesCount?: number;
  status: boolean;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    coverImage: { type: String },
    songs: [{ type: Schema.Types.ObjectId, ref: "song", required: true }],
    createdBy: { type: String, enum: ["admin", "user"], required: true },
    user: { type: Schema.Types.ObjectId, ref: "user" },
    likesCount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Optional: Hide likesCount if not a user-created playlist
playlistSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.createdBy !== "user") {
    delete obj.likesCount;
  }
  return obj;
};

const Playlist = model<IPlaylist>("playlist", playlistSchema);
export default Playlist;