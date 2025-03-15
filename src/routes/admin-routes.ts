import express from "express";
import { createAdmin, loginAdmin } from "../controllers/admin-controller";
import { validateRequest } from "../middleware/validate-request";
import { adminRegisterSchema,adminLoginSchema } from "../validations/admin-validation";

const router = express.Router();

router.post("/register", validateRequest(adminRegisterSchema), createAdmin);
router.post("/login", validateRequest(adminLoginSchema), loginAdmin);

export default router;
