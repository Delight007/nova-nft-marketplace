import { Router } from "express";
import {
  getCollectionBySlug,
  getCollections,
} from "../controllers/collection.controller.js";

const router = Router();

router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);

export default router;
