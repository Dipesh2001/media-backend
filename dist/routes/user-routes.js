"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const user_validation_1 = require("../validations/user-validation");
const auth_1 = require("../middleware/auth");
const validate_request_1 = require("../middleware/validate-request");
const router = express_1.default.Router();
router.post("/register", (0, validate_request_1.validateRequest)(user_validation_1.registerUserSchema), user_controller_1.createUser);
router.post("/login", (0, validate_request_1.validateRequest)(user_validation_1.loginUserSchema), user_controller_1.loginUser);
router.post("/logout", (0, auth_1.auth)("user"), user_controller_1.logoutUser);
router.get("/validate", (0, auth_1.auth)("user"), user_controller_1.validateUserToken);
// Favorites
router.post("/favorites", (0, auth_1.auth)("user"), (0, validate_request_1.validateRequest)(user_validation_1.manageFavoritesSchema), user_controller_1.addToFavorites);
router.delete("/favorites", (0, auth_1.auth)("user"), (0, validate_request_1.validateRequest)(user_validation_1.manageFavoritesSchema), user_controller_1.removeFromFavorites);
// Follow/Unfollow Artists
router.post("/follow", (0, auth_1.auth)("user"), (0, validate_request_1.validateRequest)(user_validation_1.manageFollowSchema), user_controller_1.followArtist);
router.delete("/unfollow", (0, auth_1.auth)("user"), (0, validate_request_1.validateRequest)(user_validation_1.manageFollowSchema), user_controller_1.unfollowArtist);
// Profile
router.get("/profile", (0, auth_1.auth)("user"), user_controller_1.getUserProfile);
exports.default = router;
