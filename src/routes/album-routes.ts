import express from "express";
import { auth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate-request";
import { upload } from "../middleware/upload";
import { handleUploadError } from "../middleware/handleUploadError";
import {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  toggleAlbumStatus,
} from "../controllers/album-controller";
import { createAlbumSchema, updateAlbumSchema } from "../validations/album-validation";

const router = express.Router();

// 📦 Create Album
router.post(
  "/",
  auth("admin"),
  (req, res, next) => {
    upload("album_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  },
  validateRequest(createAlbumSchema),
  createAlbum
);

// 📚 Get All Albums
router.get("/", auth("admin"), getAllAlbums);

// 🔍 Get Single Album
router.get("/:id", auth("admin"), getAlbumById);

// ✏️ Update Album
router.put(
  "/:id",
  auth("admin"),
  (req, res, next) => {
    upload("album_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  },
  validateRequest(updateAlbumSchema),
  updateAlbum
);

// ❌ Delete Album
router.delete("/:id", auth("admin"), deleteAlbum);

// ✅ Toggle Status
router.patch("/:id/status", auth("admin"), toggleAlbumStatus);

export default router;
