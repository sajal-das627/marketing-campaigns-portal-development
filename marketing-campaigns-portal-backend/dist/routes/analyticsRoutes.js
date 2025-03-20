"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/track", authMiddleware_1.authenticateToken, analyticsController_1.trackPerformance); // Track performance metrics
router.get("/performance/:campaignId", authMiddleware_1.authenticateToken, analyticsController_1.getCampaignPerformance); // Get campaign performance
router.get("/report", authMiddleware_1.authenticateToken, analyticsController_1.getAnalyticsReport); // Get analytics report
exports.default = router;
