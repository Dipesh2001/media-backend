import express, { NextFunction, Request } from "express";
import {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  toggleArtistStatus,
} from "../controllers/artist-controller";
import { validateRequest } from "../middleware/validate-request";
import { authAdmin } from "../middleware/auth";
import {
  createArtistSchema,
  updateArtistSchema,
} from "../validations/artist-validation";
import { handleUploadError } from "../middleware/handleUploadError";
import { upload } from "../middleware/upload";

const router = express.Router();

// Create new artist
router.post("/", authAdmin,
  (req, res, next) => {
    upload("artist_images", ["image/jpg", "image/jpeg", "image/png"]).single("image")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  },validateRequest(createArtistSchema), createArtist);

// Get all artists (optionally add pagination/query later)
router.get("/", authAdmin, getAllArtists);

// Get single artist by ID
router.get("/:id", authAdmin, getArtistById);

// Update artist by ID
router.put("/:id", authAdmin,
  (req, res, next) => {
    upload("artist_images", ["image/jpg", "image/jpeg", "image/png"]).single("image")(req, res, function (err) {
      if (err) {
        return handleUploadError(req, res, err);
      }
      next();
    });
  }, validateRequest(updateArtistSchema), updateArtist);

// Soft delete artist
router.delete("/:id", authAdmin, deleteArtist);

// Toggle active/inactive status
router.patch("/:id/status", authAdmin, toggleArtistStatus);

export default router;