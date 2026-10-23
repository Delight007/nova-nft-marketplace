import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, updateMyProfile);

export default router;
