import express from "express";
import { adminLogin, login, me, signup } from "../controllers/authController.js";
import { validateAdminKey } from "../middleware/adminKeyAuth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/admin/login", validateAdminKey, adminLogin);
router.get("/me", protect, me);

export default router;
