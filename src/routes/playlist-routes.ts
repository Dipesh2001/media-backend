// 📁 routes/playlist-routes.ts
import express from "express";
import { validateRequest } from "../middleware/validate-request";
import {
  createPlaylistSchema,
  updatePlaylistSchema,
} from "../validations/playlist-validation";
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  incrementLikesCount,
  togglePlayListStatus,
} from "../controllers/playlist-controller";
import { authAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { handleUploadError } from "../middleware/handleUploadError";

const router = express.Router();

// remember to update and check all these apis after adding user module
router.post("/", authAdmin,
  (req, res, next) => {
    upload("playlist_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  },
  validateRequest(createPlaylistSchema), createPlaylist);
router.get("/", getAllPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", authAdmin,
  (req, res, next) => {
    upload("playlist_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  },
  validateRequest(updatePlaylistSchema), updatePlaylist);
router.delete("/:id", authAdmin, deletePlaylist);
router.delete("/:id/status", authAdmin, deletePlaylist);
router.patch("/:id/status", authAdmin, togglePlayListStatus);
// router.patch("/:id/like", authAdminOrUser, incrementLikesCount);//add after user module added

export default router;