import { Router } from "express";
import { challengeWallet, verifyWallet } from "../controllers/auth.controller";
import { getCurrentUser, logout } from "../controllers/session.controller";
import { requireAuth } from "../middleware/require-auth";

const router = Router();

router.post("/challenge", challengeWallet);
router.post("/verify", verifyWallet);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;
