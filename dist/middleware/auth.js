"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = void 0;
const helper_1 = require("../helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authAdmin = async (req, res, next) => {
    try {
        const authData = req.cookies.validateAdminToken;
        if (!authData) {
            (0, helper_1.errorResponse)(res, "Access denied", {}, 401);
        }
        else {
            const token = JSON.parse(authData)?.authToken;
            const jwtSecret = process.env.JWT_SECRET || "";
            jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
                if (err || !decoded)
                    return (0, helper_1.errorResponse)(res, "Invalid token", {}, 401);
                req.admin = decoded.existingUser;
                req.authToken = token;
                next();
            });
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error while login as admin");
    }
};
exports.authAdmin = authAdmin;
