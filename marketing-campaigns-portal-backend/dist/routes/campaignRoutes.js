"use strict";
/*import express from "express";
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign  } from "../controllers/campaignController";
import { authenticateToken } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/", authenticateToken, createCampaign);
router.get("/", authenticateToken, getCampaigns);
router.put("/:id", authenticateToken, updateCampaign);
router.delete("/:id", authenticateToken, deleteCampaign);
// router.post("/trigger", authenticateToken, triggerCampaign);

export default router; */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const router = express_1.default.Router();
// router.get("/campaigns", /*authenticateToken,*/ getCampaignList); // ✅ Get Campaign List
router.post("/", /*authenticateToken,*/ campaignController_1.createOrUpdateCampaign); // Create/Update Campaign
router.get("/", /*authenticateToken,*/ campaignController_1.getCampaigns); // Get All Campaigns
router.put("/:campaignId/launch", /*authenticateToken,*/ campaignController_1.launchCampaign); // Launch Campaign
router.delete("/:campaignId", /*authenticateToken,*/ campaignController_1.deleteCampaign); // Delete Campaign
router.put("/:campaignId/edit", /*authenticateToken,*/ campaignController_1.editCampaign); // ✅ Edit Campaign
router.get("/:campaignId", /*authenticateToken,*/ campaignController_1.getCampaignById); // ✅ Get Campaign By ID
router.put("/:campaignId/pause-resume", /*authenticateToken,*/ campaignController_1.toggleCampaignStatus); // ✅ Pause/Resume Campaign
router.post("/:campaignId/duplicate", /*authenticateToken,*/ campaignController_1.duplicateCampaign); // ✅ Duplicate Campaign
exports.default = router;
