import { Router } from "express";
import {
  createNFT,
  getNFTById,
  updateNFTMint,
} from "../controllers/nft.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.post("/", requireAuth, createNFT);

router.patch("/:id/mint", requireAuth, updateNFTMint);

router.get("/:id", getNFTById);

export default router;
