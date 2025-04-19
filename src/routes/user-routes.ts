import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  validateUserToken,
  addToFavorites,
  removeFromFavorites,
  followArtist,
  unfollowArtist,
  getUserProfile,
} from "../controllers/user-controller";
import {
  registerUserSchema,
  loginUserSchema,
  manageFavoritesSchema,
  manageFollowSchema,
} from "../validations/user-validation";
import { auth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";

const router = express.Router();

router.post("/register", validateRequest(registerUserSchema), createUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/logout", auth("user"), logoutUser);
router.get("/validate", auth("user"), validateUserToken);

// Favorites
router.post("/favorites", auth("user"), validateRequest(manageFavoritesSchema), addToFavorites);
router.delete("/favorites", auth("user"), validateRequest(manageFavoritesSchema), removeFromFavorites);

// Follow/Unfollow Artists
router.post("/follow", auth("user"), validateRequest(manageFollowSchema), followArtist);
router.delete("/unfollow", auth("user"), validateRequest(manageFollowSchema), unfollowArtist);

// Profile
router.get("/profile", auth("user"), getUserProfile);

export default router;