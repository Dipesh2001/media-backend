"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.logoutAdmin = exports.loginAdmin = exports.createAdmin = void 0;
const admin_model_1 = require("../models/admin-model");
const helper_1 = require("../helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create a new user
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await admin_model_1.Admin.findOne({ email });
        if (existingUser) {
            (0, helper_1.errorResponse)(res, "Error creating admin", { field: "email", message: "Email already exists" });
        }
        else {
            const newUser = new admin_model_1.Admin({ name, email, password });
            await newUser.save();
            (0, helper_1.successResponse)(res, "Admin registered successfully", { admin: newUser });
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error creating admin", {});
    }
};
exports.createAdmin = createAdmin;
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await admin_model_1.Admin.findOne({ email });
        if (!existingUser) {
            (0, helper_1.errorResponse)(res, "Invalid Email", {});
        }
        else {
            const isMatch = await existingUser.comparePassword(password);
            if (!isMatch) {
                (0, helper_1.errorResponse)(res, "Invalid Credentials", {});
            }
            else {
                const secret = process.env.JWT_SECRET || "";
                const token = jsonwebtoken_1.default.sign({ admin: existingUser }, secret, { expiresIn: "7h" });
                // Secure HTTP-Only Cookie
                res.cookie('validateAdminToken', JSON.stringify({ admin: existingUser, authToken: token }), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development', // Use HTTPS in production
                    sameSite: 'strict',
                });
                (0, helper_1.successResponse)(res, "Admin logged in successfully", { admin: existingUser, authToken: token });
            }
        }
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error while login as admin", {});
    }
};
exports.loginAdmin = loginAdmin;
const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie('validateAdminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });
        (0, helper_1.successResponse)(res, "Logged out successfully");
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error while login as admin", {});
    }
};
exports.logoutAdmin = logoutAdmin;
const validateToken = async (req, res) => {
    try {
        (0, helper_1.successResponse)(res, "Validated admin", { admin: req.admin, authToken: req.authToken });
    }
    catch (error) {
        (0, helper_1.errorResponse)(res, "Error while login as admin", {});
    }
};
exports.validateToken = validateToken;
