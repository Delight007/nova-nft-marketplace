import { Router } from "express";
import {
  getMyCreatorAnalytics,
  getMyProfileStats,
  getMyTopCollections,
} from "../controllers/user-stats.controller.js";
import {
  getMyActivity,
  getMyCollectedNFTs,
  getMyCreatedNFTs,
  getMyListedNFTs,
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, updateMyProfile);
router.get("/me/stats", requireAuth, getMyProfileStats);
router.get("/me/nfts", requireAuth, getMyCollectedNFTs);
router.get("/me/created-nfts", requireAuth, getMyCreatedNFTs);
router.get("/me/listed-nfts", requireAuth, getMyListedNFTs);
router.get("/me/activity", requireAuth, getMyActivity);
router.get("/me/creator-analytics", requireAuth, getMyCreatorAnalytics);
router.get("/me/top-collections", requireAuth, getMyTopCollections);

export default router;
