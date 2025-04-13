import { Request, Response } from "express";
import { User } from "../models/user-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "../helper";
import { authRequest } from "../middleware/auth";

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
  res.clearCookie("validateUserToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
  successResponse(res, "Logged out");
};

export const validateUserToken = async (req: authRequest, res: Response) => {
  successResponse(res, "User validated", {
    user: req.user,
    authToken: req.authToken,
  });
};

export const addToFavorites = async (req: authRequest, res: Response) => {
  const { type, id } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { [type]: id },
  });
  successResponse(res, "Added to favorites");
};

export const removeFromFavorites = async (req: authRequest, res: Response) => {
  const { type, id } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { [type]: id },
  });
  successResponse(res, "Removed from favorites");
};

export const followArtist = async (req: authRequest, res: Response) => {
  const { artistId } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { followedArtists: artistId },
  });
  successResponse(res, "Followed artist");
};

export const unfollowArtist = async (req: authRequest, res: Response) => {
  const { artistId } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { followedArtists: artistId },
  });
  successResponse(res, "Unfollowed artist");
};

export const getUserProfile = async (req: authRequest, res: Response) => {
  const user = await User.findById(req.user._id)
    .populate("favoriteSongs favoriteAlbums favoritePlaylists followedArtists myPlaylists");

  if (!user) return errorResponse(res, "User not found");
  successResponse(res, "User profile", { user });
};
