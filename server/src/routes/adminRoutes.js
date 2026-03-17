import { Router } from "express";
import {
  getAdminAnalytics,
  getAdminProperties,
  getUsers,
  updateUser
} from "../controllers/adminController.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorizeRoles("admin"));
router.get("/analytics", getAdminAnalytics);
router.get("/properties", getAdminProperties);
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);

export default router;
