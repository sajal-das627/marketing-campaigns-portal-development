"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const campaignPerformanceSchema = new mongoose_1.default.Schema({
    campaignId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Campaign", required: true },
    emailsSent: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 }, // In percentage (0-100)
    clickRate: { type: Number, default: 0 }, // In percentage (0-100)
    conversionRate: { type: Number, default: 0 }, // In percentage (0-100)
    timestamp: { type: Date, default: Date.now }
});
const CampaignPerformance = mongoose_1.default.model("CampaignPerformance", campaignPerformanceSchema);
exports.default = CampaignPerformance;
