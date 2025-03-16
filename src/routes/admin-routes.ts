import express from "express";
import { createAdmin, loginAdmin, logoutAdmin, validateToken } from "../controllers/admin-controller";
import { validateRequest } from "../middleware/validate-request";
import { adminRegisterSchema,adminLoginSchema } from "../validations/admin-validation";
import { authAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRequest(adminRegisterSchema), createAdmin);
router.post("/login", validateRequest(adminLoginSchema), loginAdmin);
router.get("/logout", authAdmin, logoutAdmin);
router.get("/validate-auth", authAdmin, validateToken);

export default router;
