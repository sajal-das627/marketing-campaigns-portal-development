"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsReport = exports.getCampaignPerformance = exports.trackPerformance = void 0;
const CampaignPerformance_1 = __importDefault(require("../models/CampaignPerformance"));
// 1️⃣ Track Performance Metrics
const trackPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaignId, emailsSent, openRate, clickRate, conversionRate } = req.body;
        const performance = new CampaignPerformance_1.default({
            campaignId,
            emailsSent,
            openRate,
            clickRate,
            conversionRate
        });
        yield performance.save();
        res.status(201).json(performance);
    }
    catch (error) {
        res.status(500).json({ message: "Error tracking performance", error });
    }
});
exports.trackPerformance = trackPerformance;
// 2️⃣ Get Campaign Performance by ID
const getCampaignPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaignId } = req.params;
        const performance = yield CampaignPerformance_1.default.find({ campaignId }).sort({ timestamp: -1 });
        if (!performance.length)
            return res.status(404).json({ message: "No performance data found" });
        res.status(200).json(performance);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching performance", error });
    }
});
exports.getCampaignPerformance = getCampaignPerformance;
// 3️⃣ Generate Analytics Report
const getAnalyticsReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { range } = req.query; // daily, weekly, monthly
        const matchStage = {};
        const groupStage = {
            _id: "$campaignId",
            totalEmailsSent: { $sum: "$emailsSent" },
            averageOpenRate: { $avg: "$openRate" },
            averageClickRate: { $avg: "$clickRate" },
            averageConversionRate: { $avg: "$conversionRate" }
        };
        const report = yield CampaignPerformance_1.default.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $lookup: { from: "campaigns", localField: "_id", foreignField: "_id", as: "campaign" } }
        ]);
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ message: "Error generating report", error });
    }
});
exports.getAnalyticsReport = getAnalyticsReport;
