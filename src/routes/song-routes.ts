import express from "express";
import { auth } from "../middleware/auth";
import {
  createSong,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleSongStatus
} from "../controllers/song-controller";
import { validateRequest } from "../middleware/validate-request";
import { createSongSchema, updateSongSchema } from "../validations/song-validation";
import { upload } from "../middleware/upload";
import { handleUploadError } from "../middleware/handleUploadError";

const router = express.Router();

router.post(
  "/",
  auth("admin"),
  (req, res, next) => {
    upload("audio_files", ["audio/mpeg", "audio/mp3", "audio/mp4"]).single("audioFile")(req, res, function (err) {
      if (err) return handleUploadError(req, res, err);
      next();
    });
  },
  validateRequest(createSongSchema),
  createSong
);

router.get("/", auth("admin"), getAllSongs);
router.get("/:id", auth("admin"), getSongById);

router.put(
  "/:id",
  auth("admin"),
  (req, res, next) => {
    upload("audio_files", ["audio/mpeg", "audio/mp3", "audio/mp4"]).single("audioFile")(req, res, function (err) {
      if (err) return handleUploadError(req, res, err);
      next();
    });
  },
  validateRequest(updateSongSchema),
  updateSong
);

router.delete("/:id", auth("admin"), deleteSong);
router.put("/:id/status", auth("admin"), toggleSongStatus);

export default router;
