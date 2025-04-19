import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../helper";
import { authRequest } from "../middleware/auth";
import { Album } from "../models/album-model";
import { Song } from "../models/song-model";
import Playlist from "../models/playlist-model";
import { User } from "../models/user-model";
import { Artist } from "../models/artist-model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already exists", { field: "email" });
    }
    const user = new User({ name, email, password });
    await user.save();
    successResponse(res, "User registered successfully", { user });
  } catch (error) {
    errorResponse(res, "Error registering user");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, "Invalid credentials");

    const token = jwt.sign({ user }, process.env.JWT_SECRET || "", { expiresIn: "7h" });

    res.cookie("validateUserToken", JSON.stringify({ user, authToken: token }), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    successResponse(res, "Login successful", { user, authToken: token });
  } catch (error) {
    errorResponse(res, "Login failed");
  }
};

export const logoutUser = async (req: authRequest, res: Response) => {
  try {
    res.clearCookie("validateUserToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    successResponse(res, "Logged out");
  } catch (error) {
    errorResponse(res, "Error during logout");
  }
};

export const validateUserToken = async (req: authRequest, res: Response) => {
  try {
    successResponse(res, "User validated", {
      user: req.user,
      authToken: req.authToken,
    });
  } catch (error) {
    errorResponse(res, "Error validating user");
  }
};

export const addToFavorites = async (req: authRequest, res: Response) => {
  try {
    const { type, id } = req.body;

    // Update user
    await User.findByIdAndUpdate(req.user?._id, {
      $addToSet: { [type]: id },
    });

    // Update like count on the related model
    switch (type) {
      case "favoriteSongs":
        await Song.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        break;
      case "favoriteAlbums":
        await Album.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        break;
      case "favoritePlaylists":
        await Playlist.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        break;
      default:
        return errorResponse(res, "Invalid favorite type");
    }

    successResponse(res, "Added to favorites");
  } catch (error) {
    errorResponse(res, "Failed to add to favorites");
  }
};

export const removeFromFavorites = async (req: authRequest, res: Response) => {
  try {
    const { type, id } = req.body;

    // Update user
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: { [type]: id },
    });

    // Update like count on the related model
    switch (type) {
      case "favoriteSongs":
        await Song.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        break;
      case "favoriteAlbums":
        await Album.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        break;
      case "favoritePlaylists":
        await Playlist.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        break;
      default:
        return errorResponse(res, "Invalid favorite type");
    }

    successResponse(res, "Removed from favorites");
  } catch (error) {
    errorResponse(res, "Failed to remove from favorites");
  }
};

export const followArtist = async (req: authRequest, res: Response) => {
  try {
    const { artistId } = req.body;
    await User.findByIdAndUpdate(req.user?._id, {
      $addToSet: { followedArtists: artistId },
    });
    await Artist.findByIdAndUpdate(artistId, { $inc: { followers: 1 } });
    successResponse(res, "Followed artist");
  } catch (error) {
    errorResponse(res, "Failed to follow artist");
  }
};

export const unfollowArtist = async (req: authRequest, res: Response) => {
  try {
    const { artistId } = req.body;
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: { followedArtists: artistId },
    });
    successResponse(res, "Unfollowed artist");
  } catch (error) {
    errorResponse(res, "Failed to unfollow artist");
  }
};

export const getUserProfile = async (req: authRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id)
      .populate("favoriteSongs", "id name")
      .populate("favoriteAlbums", "id name")
      .populate("favoritePlaylists", "id name")
      .populate("followedArtists", "id name")
      .populate("myPlaylists", "id name");

    if (!user) return errorResponse(res, "User not found");
    successResponse(res, "User profile", { user });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Failed to fetch user profile");
  }
};
