import { Router } from "express";
import {
  getFeaturedCollections,
  getMarketplaceStats,
} from "../controllers/marketplace.controller.js";

const router = Router();

router.get("/stats", getMarketplaceStats);
router.get("/featured", getFeaturedCollections);

export default router;
