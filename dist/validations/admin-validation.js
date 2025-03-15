"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginSchema = exports.adminRegisterSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email("Invalid email format");
exports.passwordSchema = zod_1.z.string().min(6, "Password must be at least 6 characters");
exports.adminRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
exports.adminLoginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
