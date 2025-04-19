import express from "express";
import { createAdmin, loginAdmin, logoutAdmin, validateToken } from "../controllers/admin-controller";
import { validateRequest } from "../middleware/validate-request";
import { adminRegisterSchema, adminLoginSchema } from "../validations/admin-validation";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", validateRequest(adminRegisterSchema), createAdmin);
router.post("/login", validateRequest(adminLoginSchema), loginAdmin);
router.get("/logout", auth("admin"), logoutAdmin);
router.get("/validate-auth", auth("admin"), validateToken);
// router.get("/users", auth("admin"), getAllUsers);


export default router;
