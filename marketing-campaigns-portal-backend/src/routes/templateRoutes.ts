/*import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from "../controllers/templateController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createTemplate);
router.get("/", authenticateToken, getTemplates);
router.get("/:id", authenticateToken, getTemplateById);
router.put("/:id", authenticateToken, updateTemplate);
router.delete("/:id", authenticateToken, deleteTemplate);

export default router; */


import express from "express";
import { getAllTemplates, getRecentlyUsedTemplates, getPastCampaignTemplates, toggleFavoriteTemplate } from "../controllers/templateController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticateToken, getAllTemplates); // ✅ Fetch All Templates
router.get("/recent", authenticateToken, getRecentlyUsedTemplates); // ✅ Fetch Recently Used Templates
router.get("/past", authenticateToken, getPastCampaignTemplates); // ✅ Fetch Past Campaign Templates
router.put("/:templateId/favorite", authenticateToken, toggleFavoriteTemplate); // ✅ Toggle Favorite Status

export default router;


