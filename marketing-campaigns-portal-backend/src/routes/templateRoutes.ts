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
import { createTemplate, getAllTemplates, getTemplateById,previewShowTemplate,previewTemplate, updateTemplate, permanentlyDeleteTemplate, duplicateTemplate, getRecentlyUsedTemplates, getPastCampaignTemplates, toggleFavoriteTemplate, deleteTemplate } from "../controllers/templateController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", /*authenticateToken,*/ createTemplate);
router.get("/", /*authenticateToken,*/ getAllTemplates); // ✅ Fetch All Templates
router.put("/:id", /*authenticateToken,*/ updateTemplate);
router.get("/:id", /*authenticateToken,*/ getTemplateById); // ✅ Fetch Template by ID
router.get("/:id/preview", /*authenticateToken,*/ previewTemplate); // ✅ Preview  Template by ID
router.post("/preview", /*authenticateToken,*/ previewShowTemplate); // Preview template
router.post("/:id/duplicate", /*authenticateToken,*/ duplicateTemplate); // ✅ Duplicate Template Route
router.delete("/:id", /*authenticateToken,*/ deleteTemplate);
router.delete("/:id", /*authenticateToken,*/ permanentlyDeleteTemplate);
router.get("/recent", /*authenticateToken,*/ getRecentlyUsedTemplates); // ✅ Fetch Recently Used Templates
router.get("/past", /*authenticateToken,*/ getPastCampaignTemplates); // ✅ Fetch Past Campaign Templates
router.put("/:templateId/favorite", /*authenticateToken,*/ toggleFavoriteTemplate); // ✅ Toggle Favorite Status

export default router;


