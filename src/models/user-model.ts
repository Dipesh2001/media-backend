import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  favoriteSongs: mongoose.Types.ObjectId[];
  favoriteAlbums: mongoose.Types.ObjectId[];
  favoritePlaylists: mongoose.Types.ObjectId[];
  followedArtists: mongoose.Types.ObjectId[];
  myPlaylists: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },

    favoriteSongs: [
      { type: Schema.Types.ObjectId, ref: "Song", default: [] },
    ],
    favoriteAlbums: [
      { type: Schema.Types.ObjectId, ref: "Album", default: [] },
    ],
    favoritePlaylists: [
      { type: Schema.Types.ObjectId, ref: "Playlist", default: [] },
    ],
    followedArtists: [
      { type: Schema.Types.ObjectId, ref: "Artist", default: [] },
    ],
    myPlaylists: [
      { type: Schema.Types.ObjectId, ref: "Playlist", default: [] },
    ],
  },
  { timestamps: true, versionKey: false }
);

// 🔐 Password Hashing
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔍 Compare Password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);