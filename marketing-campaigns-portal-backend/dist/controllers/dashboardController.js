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
exports.getDashboardStats = void 0;
const Campaign_1 = __importDefault(require("../models/Campaign"));
const Filter_1 = __importDefault(require("../models/Filter"));
const EmailLog_1 = __importDefault(require("../models/EmailLog"));
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
// ✅ Get Dashboard Statistics
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch Active Campaigns Count
        const activeCampaigns = yield Campaign_1.default.countDocuments({ status: "Active" });
        // Fetch Scheduled Campaigns Count
        const scheduledCampaigns = yield Campaign_1.default.countDocuments({ status: "Scheduled" });
        // Fetch Total Audience Count
        const totalAudience = yield Filter_1.default.countDocuments();
        // Fetch Emails Sent (Daily, Weekly, Monthly)
        const emailsSentDaily = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        const emailsSentWeekly = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
        const emailsSentMonthly = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        // Fetch Open Rate & Click Rate (Last 30 Days)
        const emailLogs = yield EmailLog_1.default.find({ dateSent: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        const totalEmails = emailLogs.length;
        const totalOpens = emailLogs.reduce((sum, log) => sum + log.opens, 0); // ✅ Fixed
        const totalClicks = emailLogs.reduce((sum, log) => sum + log.clicks, 0); // ✅ Fixed
        const openRate = totalEmails ? ((totalOpens / totalEmails) * 100).toFixed(2) : "0";
        const clickRate = totalEmails ? ((totalClicks / totalEmails) * 100).toFixed(2) : "0";
        // Fetch Recent Activity (Last 10 Actions)
        const recentActivity = yield ActivityLog_1.default.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            activeCampaigns,
            scheduledCampaigns,
            totalAudience,
            emailsSent: {
                daily: emailsSentDaily,
                weekly: emailsSentWeekly,
                monthly: emailsSentMonthly,
            },
            engagementMetrics: {
                openRate: `${openRate}%`, // ✅ Fixed template string
                clickRate: `${clickRate}%`, // ✅ Fixed template string
            },
            recentActivity,
        });
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getDashboardStats = getDashboardStats;
