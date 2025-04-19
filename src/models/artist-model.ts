import mongoose, { Schema, Document } from "mongoose";

// Define Interface
export interface IArtist extends Document {
  name: string;
  image?: string; // URL or path to the image
  bio?: string;
  country?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  followers: number;
  isActive: boolean;
}

// Define Schema
const ArtistSchema = new Schema<IArtist>(
  {
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
  },
  { timestamps: true, versionKey: false }
);

ArtistSchema.method("toJSON", function () {
  const artist = this.toObject();
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";

  if (artist.image) {
    // Convert local image path to full URL
    artist.image = `${baseUrl}/${artist.image.replace(/\\/g, "/").replace(/^.*uploads/, "uploads")}`;
  }

  return artist;
});

// Export model
export const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);