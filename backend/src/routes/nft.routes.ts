import { Router } from "express";
import {
  buyNFT,
  cancelNFTListing,
  createNFT,
  getNFTById,
  listNFT,
  updateNFTMint,
} from "../controllers/nft.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.post("/", requireAuth, createNFT);

router.patch("/:id/mint", requireAuth, updateNFTMint);

router.get("/:id", getNFTById);
router.post("/:id/listings", requireAuth, listNFT);
router.post("/:id/listings/cancel", requireAuth, cancelNFTListing);
router.post("/:id/buy", requireAuth, buyNFT);

export default router;
