"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const upload_1 = require("../middleware/upload");
const handleUploadError_1 = require("../middleware/handleUploadError");
const album_controller_1 = require("../controllers/album-controller");
const album_validation_1 = require("../validations/album-validation");
const router = express_1.default.Router();
// 📦 Create Album
router.post("/", (0, auth_1.auth)("admin"), (req, res, next) => {
    (0, upload_1.upload)("album_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(album_validation_1.createAlbumSchema), album_controller_1.createAlbum);
// 📚 Get All Albums
router.get("/", (0, auth_1.auth)("admin"), album_controller_1.getAllAlbums);
// 🔍 Get Single Album
router.get("/:id", (0, auth_1.auth)("admin"), album_controller_1.getAlbumById);
// ✏️ Update Album
router.put("/:id", (0, auth_1.auth)("admin"), (req, res, next) => {
    (0, upload_1.upload)("album_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(album_validation_1.updateAlbumSchema), album_controller_1.updateAlbum);
// ❌ Delete Album
router.delete("/:id", (0, auth_1.auth)("admin"), album_controller_1.deleteAlbum);
// ✅ Toggle Status
router.patch("/:id/status", (0, auth_1.auth)("admin"), album_controller_1.toggleAlbumStatus);
exports.default = router;
