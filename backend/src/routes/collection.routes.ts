import { Router } from "express";
import {
  getCollectionActivity,
  getCollectionBySlug,
  getCollections,
} from "../controllers/collection.controller.js";

const router = Router();

router.get("/", getCollections);
router.get("/:slug/activity", getCollectionActivity);
router.get("/:slug", getCollectionBySlug);

export default router;
