import express from "express";
import { authAdmin } from "../middleware/auth";
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
  authAdmin,
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
router.get("/", authAdmin, getAllAlbums);

// 🔍 Get Single Album
router.get("/:id", authAdmin, getAlbumById);

// ✏️ Update Album
router.put(
  "/:id",
  authAdmin,
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
router.delete("/:id", authAdmin, deleteAlbum);

// ✅ Toggle Status
router.patch("/:id/status", authAdmin, toggleAlbumStatus);

export default router;
