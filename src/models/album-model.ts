import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IAlbum extends Document {
  name: string;
  coverImage: string;
  artists: Types.ObjectId[]; // Multiple artists
  genre: string;
  language: string;
  description?: string;
  releaseDate: Date;
  status: boolean;
  likes:number,
}

const AlbumSchema = new Schema<IAlbum>(
  {
    name: { type: String, required: true },
    coverImage: { type: String, required: false },
    artists: [{ type: Schema.Types.ObjectId, ref: "Artist", required: false }], // 👈 modified
    genre: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String },
    releaseDate: { type: Date, required: true },
    status: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

// Define Album Model interface with statics
interface AlbumModel extends Model<IAlbum> {
  findAllWithArtists(): Promise<IAlbum[]>;
  findByIdWithArtists(id: string): Promise<IAlbum | null>;
}

// Automatically format the coverImage to full URL
AlbumSchema.method("toJSON", function () {
  const album = this.toObject();
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";
  if (album.coverImage) {
    album.coverImage = `${baseUrl}/${album.coverImage.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
  }
  return album;
});

AlbumSchema.statics.findByIdWithArtists = function (id: string) {
  return this.findById(id).populate("artists","name image");
};

export const Album = mongoose.model<IAlbum,AlbumModel>("Album", AlbumSchema);