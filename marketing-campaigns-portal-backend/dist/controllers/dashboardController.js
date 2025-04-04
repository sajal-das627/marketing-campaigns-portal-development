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
const getStartOfMonth = (month, year) => new Date(year, month, 1);
const getEndOfMonth = (month, year) => new Date(year, month + 1, 0, 23, 59, 59, 999);
const getDateRange = (daysAgo) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const getThisMonthDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return { start: getStartOfMonth(month, year), end: getEndOfMonth(month, year) };
};
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [activeCampaigns, scheduledCampaigns, totalAudience] = yield Promise.all([Campaign_1.default.countDocuments({ status: "Active" }), Campaign_1.default.countDocuments({ status: "Scheduled" }), Filter_1.default.countDocuments(),]);
        const emailsSentDaily = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: getDateRange(1) } });
        const emailsSentWeekly = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: getDateRange(7) } });
        const emailsSentMonthly = yield EmailLog_1.default.countDocuments({ dateSent: { $gte: getDateRange(30) } });
        const now = new Date();
        const year = now.getFullYear();
        const monthlyEmailStats = yield Promise.all(Array.from({ length: 12 }, (_, month) => __awaiter(void 0, void 0, void 0, function* () {
            const from = getStartOfMonth(month, year);
            const to = getEndOfMonth(month, year);
            const dailyLogs = yield EmailLog_1.default.find({ dateSent: { $gte: new Date(to.getTime() - 24 * 60 * 60 * 1000), $lte: to } });
            const weeklyLogs = yield EmailLog_1.default.find({ dateSent: { $gte: new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000), $lte: to } });
            const monthlyLogs = yield EmailLog_1.default.find({ dateSent: { $gte: from, $lte: to } });
            const formatStats = (logs) => {
                const opens = logs.reduce((sum, log) => sum + log.opens, 0);
                const clicks = logs.reduce((sum, log) => sum + log.clicks, 0);
                const total = logs.length;
                return {
                    emailsSent: total,
                    openRate: total ? Number(((opens / total) * 100).toFixed(2)) : 0,
                    clickRate: total ? Number(((clicks / total) * 100).toFixed(2)) : 0,
                };
            };
            return {
                month: from.toLocaleString("default", { month: "short" }),
                daily: formatStats(dailyLogs),
                weekly: formatStats(weeklyLogs),
                monthly: formatStats(monthlyLogs),
            };
        })));
        // Updated Campaign Performance (Daily/Weekly/Monthly) for current month only
        const { start, end } = getThisMonthDates();
        const emailLogsThisMonth = yield EmailLog_1.default.find({ dateSent: { $gte: start, $lte: end } });
        const getPerformanceStats = (logs) => {
            const dateMap = {};
            logs.forEach((log) => {
                const dateKey = log.dateSent.toISOString().slice(0, 10);
                if (!dateMap[dateKey]) {
                    dateMap[dateKey] = { opens: 0, clicks: 0, total: 0 };
                }
                dateMap[dateKey].opens += log.opens;
                dateMap[dateKey].clicks += log.clicks;
                dateMap[dateKey].total += 1;
            });
            return Object.entries(dateMap)
                .map(([date, { opens, clicks, total }]) => ({
                date,
                openRate: total ? Number(((opens / total) * 100).toFixed(2)) : 0,
                clickRate: total ? Number(((clicks / total) * 100).toFixed(2)) : 0,
            }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        };
        const campaignPerformance = {
            daily: getPerformanceStats(emailLogsThisMonth.filter((log) => log.dateSent >= getDateRange(1))),
            weekly: getPerformanceStats(emailLogsThisMonth.filter((log) => log.dateSent >= getDateRange(7))),
            monthly: getPerformanceStats(emailLogsThisMonth.filter((log) => log.dateSent >= getDateRange(30))),
            yAxisMax: 1000,
        };
        const emailLogsLast30Days = yield EmailLog_1.default.find({ dateSent: { $gte: getDateRange(30) } });
        const totalEmails = emailLogsLast30Days.length;
        const totalOpens = emailLogsLast30Days.reduce((sum, log) => sum + log.opens, 0);
        const totalClicks = emailLogsLast30Days.reduce((sum, log) => sum + log.clicks, 0);
        const openRate = totalEmails ? ((totalOpens / totalEmails) * 100).toFixed(2) : "0";
        const clickRate = totalEmails ? ((totalClicks / totalEmails) * 100).toFixed(2) : "0";
        const recentActivity = yield ActivityLog_1.default.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            activeCampaigns,
            scheduledCampaigns,
            totalAudience,
            emailsSent: {
                daily: emailsSentDaily,
                weekly: emailsSentWeekly,
                monthly: emailsSentMonthly,
                monthlyStats: monthlyEmailStats,
                yAxisMax: 2000,
            },
            campaignPerformance,
            engagementMetrics: {
                openRate: `${openRate}%`,
                clickRate: `${clickRate}%`,
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
