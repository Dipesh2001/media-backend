"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const song_controller_1 = require("../controllers/song-controller");
const validate_request_1 = require("../middleware/validate-request");
const song_validation_1 = require("../validations/song-validation");
const upload_1 = require("../middleware/upload");
const handleUploadError_1 = require("../middleware/handleUploadError");
const router = express_1.default.Router();
router.post("/", auth_1.authAdmin, (req, res, next) => {
    (0, upload_1.upload)("audio_files", ["audio/mpeg", "audio/mp3", "audio/mp4"]).single("audioFile")(req, res, function (err) {
        if (err)
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        next();
    });
}, (0, validate_request_1.validateRequest)(song_validation_1.createSongSchema), song_controller_1.createSong);
router.get("/", auth_1.authAdmin, song_controller_1.getAllSongs);
router.get("/:id", auth_1.authAdmin, song_controller_1.getSongById);
router.put("/:id", auth_1.authAdmin, (req, res, next) => {
    (0, upload_1.upload)("audio_files", ["audio/mpeg", "audio/mp3", "audio/mp4"]).single("audioFile")(req, res, function (err) {
        if (err)
            return (0, handleUploadError_1.handleUploadError)(req, res, err);
        next();
    });
}, (0, validate_request_1.validateRequest)(song_validation_1.updateSongSchema), song_controller_1.updateSong);
router.delete("/:id", auth_1.authAdmin, song_controller_1.deleteSong);
router.put("/:id/status", auth_1.authAdmin, song_controller_1.toggleSongStatus);
exports.default = router;
