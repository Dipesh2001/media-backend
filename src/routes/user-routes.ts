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
import { authUser } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";

const router = express.Router();

router.post("/register", validateRequest(registerUserSchema), createUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.post("/logout", authUser, logoutUser);
router.get("/validate", authUser, validateUserToken);

// Favorites
router.post("/favorites", authUser, validateRequest(manageFavoritesSchema), addToFavorites);
router.delete("/favorites", authUser, validateRequest(manageFavoritesSchema), removeFromFavorites);

// Follow/Unfollow Artists
router.post("/follow", authUser, validateRequest(manageFollowSchema), followArtist);
router.delete("/unfollow", authUser, validateRequest(manageFollowSchema), unfollowArtist);

// Profile
router.get("/me", authUser, getUserProfile);

export default router;