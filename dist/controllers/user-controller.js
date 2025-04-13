"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.unfollowArtist = exports.followArtist = exports.removeFromFavorites = exports.addToFavorites = exports.validateUserToken = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const user_model_1 = require("../models/user-model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../helper");
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return (0, helper_1.errorResponse)(res, "User already exists", { field: "email" });
        }
        const user = new user_model_1.User({ name, email, password });
        await user.save();
        (0, helper_1.successResponse)(res, "User registered successfully", { user });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error registering user");
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return (0, helper_1.errorResponse)(res, "User not found");
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return (0, helper_1.errorResponse)(res, "Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET || "", { expiresIn: "7h" });
        res.cookie("validateUserToken", JSON.stringify({ user, authToken: token }), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
        });
        (0, helper_1.successResponse)(res, "Login successful", { user, authToken: token });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Login failed");
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    res.clearCookie("validateUserToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
    });
    (0, helper_1.successResponse)(res, "Logged out");
};
exports.logoutUser = logoutUser;
const validateUserToken = async (req, res) => {
    (0, helper_1.successResponse)(res, "User validated", {
        user: req.user,
        authToken: req.authToken,
    });
};
exports.validateUserToken = validateUserToken;
const addToFavorites = async (req, res) => {
    const { type, id } = req.body;
    await user_model_1.User.findByIdAndUpdate(req.user._id, {
        $addToSet: { [type]: id },
    });
    (0, helper_1.successResponse)(res, "Added to favorites");
};
exports.addToFavorites = addToFavorites;
const removeFromFavorites = async (req, res) => {
    const { type, id } = req.body;
    await user_model_1.User.findByIdAndUpdate(req.user._id, {
        $pull: { [type]: id },
    });
    (0, helper_1.successResponse)(res, "Removed from favorites");
};
exports.removeFromFavorites = removeFromFavorites;
const followArtist = async (req, res) => {
    const { artistId } = req.body;
    await user_model_1.User.findByIdAndUpdate(req.user._id, {
        $addToSet: { followedArtists: artistId },
    });
    (0, helper_1.successResponse)(res, "Followed artist");
};
exports.followArtist = followArtist;
const unfollowArtist = async (req, res) => {
    const { artistId } = req.body;
    await user_model_1.User.findByIdAndUpdate(req.user._id, {
        $pull: { followedArtists: artistId },
    });
    (0, helper_1.successResponse)(res, "Unfollowed artist");
};
exports.unfollowArtist = unfollowArtist;
const getUserProfile = async (req, res) => {
    const user = await user_model_1.User.findById(req.user._id)
        .populate("favoriteSongs favoriteAlbums favoritePlaylists followedArtists myPlaylists");
    if (!user)
        return (0, helper_1.errorResponse)(res, "User not found");
    (0, helper_1.successResponse)(res, "User profile", { user });
};
exports.getUserProfile = getUserProfile;
