"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📁 routes/playlist-routes.ts
const express_1 = __importDefault(require("express"));
const validate_request_1 = require("../middleware/validate-request");
const playlist_validation_1 = require("../validations/playlist-validation");
const playlist_controller_1 = require("../controllers/playlist-controller");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const handleUploadError_1 = require("../middleware/handleUploadError");
const router = express_1.default.Router();
// remember to update and check all these apis after adding user module
router.post("/", (0, auth_1.auth)("admin"), (req, res, next) => {
    (0, upload_1.upload)("playlist_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(playlist_validation_1.createPlaylistSchema), playlist_controller_1.createPlaylist);
router.get("/", (0, auth_1.auth)(), playlist_controller_1.getAllPlaylists);
router.get("/:id", playlist_controller_1.getPlaylistById);
router.put("/:id", (0, auth_1.auth)("admin"), (req, res, next) => {
    (0, upload_1.upload)("playlist_images", ["image/jpg", "image/jpeg", "image/png"]).single("coverImage")(req, res, function (err) {
        if (err) {
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        }
        next();
    });
}, (0, validate_request_1.validateRequest)(playlist_validation_1.updatePlaylistSchema), playlist_controller_1.updatePlaylist);
router.delete("/:id", (0, auth_1.auth)("admin"), playlist_controller_1.deletePlaylist);
router.delete("/:id/status", (0, auth_1.auth)("admin"), playlist_controller_1.deletePlaylist);
router.patch("/:id/status", (0, auth_1.auth)("admin"), playlist_controller_1.togglePlayListStatus);
// router.patch("/:id/like", authAdminOrUser, incrementLikesCount);//add after user module added
exports.default = router;
