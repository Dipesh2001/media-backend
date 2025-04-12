"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artist_controller_1 = require("../controllers/artist-controller");
const validate_request_1 = require("../middleware/validate-request");
const auth_1 = require("../middleware/auth");
const artist_validation_1 = require("../validations/artist-validation");
const handleUploadError_1 = require("../middleware/handleUploadError");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Create new artist
router.post("/", auth_1.authAdmin, (req, res, next) => {
    (0, upload_1.upload)("artist_images", ["image/jpg", "image/jpeg", "image/png"]).single("image")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(artist_validation_1.createArtistSchema), artist_controller_1.createArtist);
// Get all artists (optionally add pagination/query later)
router.get("/", auth_1.authAdmin, artist_controller_1.getAllArtists);
// Get single artist by ID
router.get("/:id", auth_1.authAdmin, artist_controller_1.getArtistById);
// Update artist by ID
router.put("/:id", auth_1.authAdmin, (req, res, next) => {
    (0, upload_1.upload)("artist_images", ["image/jpg", "image/jpeg", "image/png"]).single("image")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(artist_validation_1.updateArtistSchema), artist_controller_1.updateArtist);
// Soft delete artist
router.delete("/:id", auth_1.authAdmin, artist_controller_1.deleteArtist);
// Toggle active/inactive status
router.patch("/:id/status", auth_1.authAdmin, artist_controller_1.toggleArtistStatus);
exports.default = router;
