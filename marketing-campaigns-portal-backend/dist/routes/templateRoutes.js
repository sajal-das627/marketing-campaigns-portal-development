"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const templateController_1 = require("../controllers/templateController");
const router = express_1.default.Router();
router.post("/", /*authenticateToken,*/ templateController_1.createTemplate);
router.get("/", /*authenticateToken,*/ templateController_1.getAllTemplates); // ✅ Fetch All Templates
router.put("/:id", /*authenticateToken,*/ templateController_1.updateTemplate);
router.get("/recent", /*authenticateToken,*/ templateController_1.getRecentlyUsedTemplates); // ✅ Fetch Recently Used Templates
router.get("/past", /*authenticateToken,*/ templateController_1.getPastCampaignTemplates); // ✅ Fetch Past Campaign Templates
router.get("/favorites", /*authenticateToken,*/ templateController_1.getFavoriteTemplates); // ✅ Fetch Favorite Templates
router.get("/:id", /*authenticateToken,*/ templateController_1.getTemplateById); // ✅ Fetch Template by ID
router.get("/:id/preview", /*authenticateToken,*/ templateController_1.previewTemplate); // ✅ Preview  Template by ID
router.post("/preview", /*authenticateToken,*/ templateController_1.previewShowTemplate); // Preview template
router.post("/:id/duplicate", /*authenticateToken,*/ templateController_1.duplicateTemplate); // ✅ Duplicate Template Route
router.delete("/:id", /*authenticateToken,*/ templateController_1.deleteTemplate); // ✅ Soft Delete Template
router.patch("/:id/restore", /*authenticateToken,*/ templateController_1.restoreTemplateById); // ✅ restore template endpoint
// router.delete("/:id", /*authenticateToken,*/ permanentlyDeleteTemplate); // ✅ Permanently Delete Template
router.put("/:templateId/favorite", /*authenticateToken,*/ templateController_1.toggleFavoriteTemplate); // ✅ Toggle Favorite Status
exports.default = router;
