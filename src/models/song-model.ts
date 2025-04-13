import mongoose, { Schema, Document, Types  } from "mongoose";

export interface ISong extends Document {
  name: string;
  album: Types.ObjectId;
  artists?: Types.ObjectId[];
  audioFile: string;
  duration: number; // in seconds (or milliseconds if preferred)
  description?: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  plays: number;
  likes: number;
}

const songSchema = new Schema<ISong>(
  {
    name: { type: String, required: true },
    album: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    artists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    audioFile: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String },
    status: { type: Boolean, default: true },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

songSchema.method("toJSON", function () {
  const song = this.toObject();
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";
  if (song.audioFile) {
    song.audioFile = `${baseUrl}/${song.audioFile.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
  }
  return song;
});

export const Song = mongoose.model<ISong>("song", songSchema);
