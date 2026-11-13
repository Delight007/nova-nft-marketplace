import { Router } from "express";
import {
  getFeaturedCollections,
  getMarketplaceActivity,
  getMarketplaceStats,
  getRecentCollectionVolume,
  getSolPrice,
} from "../controllers/marketplace.controller.js";

const router = Router();

router.get("/stats", getMarketplaceStats);
router.get("/featured", getFeaturedCollections);
router.get("/activity", getMarketplaceActivity);
router.get("/collection-volumes", getRecentCollectionVolume);
router.get("/sol-price", getSolPrice);

export default router;
