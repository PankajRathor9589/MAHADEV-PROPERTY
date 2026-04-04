import { Router } from "express";
import { adminLogin, getMe, login, register } from "../controllers/authController.js";
import { validateAdminKey } from "../middleware/adminKeyAuth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", validateAdminKey, adminLogin);
router.get("/me", protect, getMe);

export default router;
