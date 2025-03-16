"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin-controller");
const validate_request_1 = require("../middleware/validate-request");
const admin_validation_1 = require("../validations/admin-validation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", (0, validate_request_1.validateRequest)(admin_validation_1.adminRegisterSchema), admin_controller_1.createAdmin);
router.post("/login", (0, validate_request_1.validateRequest)(admin_validation_1.adminLoginSchema), admin_controller_1.loginAdmin);
router.get("/logout", auth_1.authAdmin, admin_controller_1.logoutAdmin);
router.get("/validate-auth", auth_1.authAdmin, admin_controller_1.validateToken);
exports.default = router;
