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
const getDateRange = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const getStartOfMonth = (month, year) => new Date(year, month, 1);
const getEndOfMonth = (month, year) => new Date(year, month + 1, 0, 23, 59, 59, 999);
const getStartOfYear = (year) => new Date(year, 0, 1);
const getEndOfYear = (year) => new Date(year, 11, 31, 23, 59, 59, 999);
const getThisMonthDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return { start: getStartOfMonth(month, year), end: getEndOfMonth(month, year) };
};
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const timeFilters = {
            daily: getDateRange(1),
            weekly: getDateRange(7),
            monthly: getDateRange(30),
            yearly: getStartOfYear(currentYear),
        };
        const totalCampaigns = yield Campaign_1.default.countDocuments();
        const totalFilters = yield Filter_1.default.countDocuments();
        const getCountAndPercentage = (query, total) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield Campaign_1.default.countDocuments(query);
            const percentage = total > 0 ? +(count / total * 100).toFixed(2) : 0;
            return { count, percentage };
        });
        const activeCampaigns = {
            daily: yield getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.daily } }, totalCampaigns),
            weekly: yield getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.weekly } }, totalCampaigns),
            monthly: yield getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.monthly } }, totalCampaigns),
            yearly: yield getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.yearly } }, totalCampaigns),
        };
        const scheduledCampaigns = {
            daily: yield getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.daily } }, totalCampaigns),
            weekly: yield getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.weekly } }, totalCampaigns),
            monthly: yield getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.monthly } }, totalCampaigns),
            yearly: yield getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.yearly } }, totalCampaigns),
        };
        const totalAudience = {
            daily: yield getCountAndPercentage({ createdAt: { $gte: timeFilters.daily } }, totalFilters),
            weekly: yield getCountAndPercentage({ createdAt: { $gte: timeFilters.weekly } }, totalFilters),
            monthly: yield getCountAndPercentage({ createdAt: { $gte: timeFilters.monthly } }, totalFilters),
            yearly: yield getCountAndPercentage({ createdAt: { $gte: timeFilters.yearly } }, totalFilters),
        };
        const emailsSentStats = {};
        for (const key of Object.keys(timeFilters)) {
            const campaigns = yield Campaign_1.default.find({ createdAt: { $gte: timeFilters[key] } });
            const count = campaigns.length;
            const totalOpens = campaigns.reduce((sum, c) => { var _a; return sum + Number((_a = c.openRate) !== null && _a !== void 0 ? _a : 0); }, 0);
            const totalClicks = campaigns.reduce((sum, c) => { var _a; return sum + Number((_a = c.ctr) !== null && _a !== void 0 ? _a : 0); }, 0);
            const openRate = count ? +(totalOpens / count).toFixed(2) : 0;
            const clickRate = count ? +(totalClicks / count).toFixed(2) : 0;
            emailsSentStats[key] = { emailsSent: count, openRate, clickRate };
        }
        const monthlyEmailStats = yield Promise.all(Array.from({ length: 12 }, (_, month) => __awaiter(void 0, void 0, void 0, function* () {
            const from = getStartOfMonth(month, currentYear);
            const to = getEndOfMonth(month, currentYear);
            const logs = yield Campaign_1.default.find({ createdAt: { $gte: from, $lte: to } });
            const openRate = logs.length
                ? +(logs.reduce((sum, c) => { var _a; return sum + Number((_a = c.openRate) !== null && _a !== void 0 ? _a : 0); }, 0) / logs.length).toFixed(2)
                : 0;
            const clickRate = logs.length
                ? +(logs.reduce((sum, c) => { var _a; return sum + Number((_a = c.ctr) !== null && _a !== void 0 ? _a : 0); }, 0) / logs.length).toFixed(2)
                : 0;
            return {
                month: from.toLocaleString("default", { month: "short" }),
                daily: emailsSentStats.daily,
                weekly: emailsSentStats.weekly,
                monthly: { emailsSent: logs.length, openRate, clickRate },
            };
        })));
        const { start, end } = getThisMonthDates();
        const currentMonthCampaigns = yield Campaign_1.default.find({ createdAt: { $gte: start, $lte: end } });
        const aggregatePerformance = (logs) => {
            const grouped = {};
            logs.forEach((log) => {
                var _a, _b;
                const dateKey = log.createdAt.toISOString().slice(0, 10);
                if (!grouped[dateKey])
                    grouped[dateKey] = { opens: 0, clicks: 0, total: 0 };
                grouped[dateKey].opens += Number((_a = log.openRate) !== null && _a !== void 0 ? _a : 0);
                grouped[dateKey].clicks += Number((_b = log.ctr) !== null && _b !== void 0 ? _b : 0);
                grouped[dateKey].total += 1;
            });
            return Object.entries(grouped).map(([date, data]) => ({
                date,
                openRate: data.total ? +(data.opens / data.total).toFixed(2) : 0,
                clickRate: data.total ? +(data.clicks / data.total).toFixed(2) : 0,
            }));
        };
        const campaignPerformance = {
            daily: aggregatePerformance(currentMonthCampaigns.filter((c) => c.createdAt >= timeFilters.daily)),
            weekly: aggregatePerformance(currentMonthCampaigns.filter((c) => c.createdAt >= timeFilters.weekly)),
            monthly: aggregatePerformance(currentMonthCampaigns),
            yAxisMax: 1000,
        };
        const recentActivity = yield Campaign_1.default.find({})
            .sort({ createdAt: 1 })
            .limit(10)
            .populate("userId", "firstName lastName email")
            .select("name createdAt userId");
        res.status(200).json({
            activeCampaigns,
            scheduledCampaigns,
            totalAudience,
            emailsSent: Object.assign(Object.assign({}, emailsSentStats), { monthlyStats: monthlyEmailStats, yAxisMax: 2000 }),
            campaignPerformance,
            engagementMetrics: {
                openRate: `${((_a = emailsSentStats.monthly) === null || _a === void 0 ? void 0 : _a.openRate) || 0}%`,
                clickRate: `${((_b = emailsSentStats.monthly) === null || _b === void 0 ? void 0 : _b.clickRate) || 0}%`,
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
