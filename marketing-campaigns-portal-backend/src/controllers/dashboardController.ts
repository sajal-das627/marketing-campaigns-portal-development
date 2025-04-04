import { Request, Response } from "express";
import Campaign from "../models/Campaign";
import Filter from "../models/Filter";
import EmailLog from "../models/EmailLog";
import ActivityLog from "../models/ActivityLog";

const getStartOfMonth = (month: number, year: number) => new Date(year, month, 1);
const getEndOfMonth = (month: number, year: number) => new Date(year, month + 1, 0, 23, 59, 59, 999);
const getDateRange = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const getThisMonthDates = () => {
  const now = new Date(); const year = now.getFullYear();
  const month = now.getMonth(); return { start: getStartOfMonth(month, year), end: getEndOfMonth(month, year) };
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [activeCampaigns, scheduledCampaigns, totalAudience] = await Promise.all([Campaign.countDocuments({ status: "Active" }), Campaign.countDocuments({ status: "Scheduled" }), Filter.countDocuments(),]);

    const emailsSentDaily = await EmailLog.countDocuments({ dateSent: { $gte: getDateRange(1) } });
    const emailsSentWeekly = await EmailLog.countDocuments({ dateSent: { $gte: getDateRange(7) } });
    const emailsSentMonthly = await EmailLog.countDocuments({ dateSent: { $gte: getDateRange(30) } });

    const now = new Date();
    const year = now.getFullYear();

    const monthlyEmailStats = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const from = getStartOfMonth(month, year);
        const to = getEndOfMonth(month, year);

        const dailyLogs = await EmailLog.find({ dateSent: { $gte: new Date(to.getTime() - 24 * 60 * 60 * 1000), $lte: to } });
        const weeklyLogs = await EmailLog.find({ dateSent: { $gte: new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000), $lte: to } });
        const monthlyLogs = await EmailLog.find({ dateSent: { $gte: from, $lte: to } });

        const formatStats = (logs: typeof monthlyLogs) => {
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
      })
    );

    // Updated Campaign Performance (Daily/Weekly/Monthly) for current month only
    const { start, end } = getThisMonthDates();
    const emailLogsThisMonth = await EmailLog.find({ dateSent: { $gte: start, $lte: end } });

    const getPerformanceStats = (logs: typeof emailLogsThisMonth) => {
      const dateMap: { [date: string]: { opens: number; clicks: number; total: number } } = {};

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

    const emailLogsLast30Days = await EmailLog.find({ dateSent: { $gte: getDateRange(30) } });
    const totalEmails = emailLogsLast30Days.length;
    const totalOpens = emailLogsLast30Days.reduce((sum, log) => sum + log.opens, 0);
    const totalClicks = emailLogsLast30Days.reduce((sum, log) => sum + log.clicks, 0);
    const openRate = totalEmails ? ((totalOpens / totalEmails) * 100).toFixed(2) : "0";
    const clickRate = totalEmails ? ((totalClicks / totalEmails) * 100).toFixed(2) : "0";

    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);

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
  } catch (error) { console.error("Error fetching dashboard data:", error); res.status(500).json({ message: "Internal Server Error" }); }
};