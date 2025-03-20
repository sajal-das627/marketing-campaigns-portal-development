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
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateToken, templateController_1.getAllTemplates); // ✅ Fetch All Templates
router.get("/recent", authMiddleware_1.authenticateToken, templateController_1.getRecentlyUsedTemplates); // ✅ Fetch Recently Used Templates
router.get("/past", authMiddleware_1.authenticateToken, templateController_1.getPastCampaignTemplates); // ✅ Fetch Past Campaign Templates
router.put("/:templateId/favorite", authMiddleware_1.authenticateToken, templateController_1.toggleFavoriteTemplate); // ✅ Toggle Favorite Status
exports.default = router;
