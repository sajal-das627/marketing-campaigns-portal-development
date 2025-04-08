import { Request, Response } from "express";
import Campaign, { ICampaign } from "../models/Campaign";
import Filter from "../models/Filter";
import User from "../models/User";

const getDateRange = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const getStartOfMonth = (month: number, year: number) => new Date(year, month, 1);
const getEndOfMonth = (month: number, year: number) => new Date(year, month + 1, 0, 23, 59, 59, 999);
const getStartOfYear = (year: number) => new Date(year, 0, 1);
const getEndOfYear = (year: number) => new Date(year, 11, 31, 23, 59, 59, 999);

const getThisMonthDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return { start: getStartOfMonth(month, year), end: getEndOfMonth(month, year) };
};

type TimeFilterKey = "daily" | "weekly" | "monthly" | "yearly";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const timeFilters: Record<TimeFilterKey, Date> = {
      daily: getDateRange(1),
      weekly: getDateRange(7),
      monthly: getDateRange(30),
      yearly: getStartOfYear(currentYear),
    };

    const totalCampaigns = await Campaign.countDocuments();
    const totalFilters = await Filter.countDocuments();

    const getCountAndPercentage = async (
      query: any,
      total: number
    ): Promise<{ count: number; percentage: number }> => {
      const count = await Campaign.countDocuments(query);
      const percentage = total > 0 ? +(count / total * 100).toFixed(2) : 0;
      return { count, percentage };
    };

    const activeCampaigns: Record<TimeFilterKey, any> = {
      daily: await getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.daily } }, totalCampaigns),
      weekly: await getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.weekly } }, totalCampaigns),
      monthly: await getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.monthly } }, totalCampaigns),
      yearly: await getCountAndPercentage({ status: "Active", createdAt: { $gte: timeFilters.yearly } }, totalCampaigns),
    };

    const scheduledCampaigns: Record<TimeFilterKey, any> = {
      daily: await getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.daily } }, totalCampaigns),
      weekly: await getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.weekly } }, totalCampaigns),
      monthly: await getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.monthly } }, totalCampaigns),
      yearly: await getCountAndPercentage({ status: "Scheduled", startDate: { $gte: timeFilters.yearly } }, totalCampaigns),
    };

    const totalAudience: Record<TimeFilterKey, any> = {
      daily: await getCountAndPercentage({ createdAt: { $gte: timeFilters.daily } }, totalFilters),
      weekly: await getCountAndPercentage({ createdAt: { $gte: timeFilters.weekly } }, totalFilters),
      monthly: await getCountAndPercentage({ createdAt: { $gte: timeFilters.monthly } }, totalFilters),
      yearly: await getCountAndPercentage({ createdAt: { $gte: timeFilters.yearly } }, totalFilters),
    };

    const emailsSentStats: any = {};
    for (const key of Object.keys(timeFilters) as TimeFilterKey[]) {
      const campaigns: ICampaign[] = await Campaign.find({ createdAt: { $gte: timeFilters[key] } });
      const count = campaigns.length;
      const totalOpens = campaigns.reduce((sum, c) => sum + Number(c.openRate ?? 0), 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + Number(c.ctr ?? 0), 0);
      const openRate = count ? +(totalOpens / count).toFixed(2) : 0;
      const clickRate = count ? +(totalClicks / count).toFixed(2) : 0;
      emailsSentStats[key] = { emailsSent: count, openRate, clickRate };
    }

    const monthlyEmailStats = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const from = getStartOfMonth(month, currentYear);
        const to = getEndOfMonth(month, currentYear);
        const logs = await Campaign.find({ createdAt: { $gte: from, $lte: to } });

        const openRate = logs.length
          ? +(logs.reduce((sum, c) => sum + Number(c.openRate ?? 0), 0) / logs.length).toFixed(2)
          : 0;
        const clickRate = logs.length
          ? +(logs.reduce((sum, c) => sum + Number(c.ctr ?? 0), 0) / logs.length).toFixed(2)
          : 0;

        return {
          month: from.toLocaleString("default", { month: "short" }),
          daily: emailsSentStats.daily,
          weekly: emailsSentStats.weekly,
          monthly: { emailsSent: logs.length, openRate, clickRate },
        };
      })
    );

    const { start, end } = getThisMonthDates();
    const currentMonthCampaigns: ICampaign[] = await Campaign.find({ createdAt: { $gte: start, $lte: end } });

    const aggregatePerformance = (logs: ICampaign[]) => {
      const grouped: Record<string, { opens: number; clicks: number; total: number }> = {};
      logs.forEach((log) => {
        const dateKey = log.createdAt.toISOString().slice(0, 10);
        if (!grouped[dateKey]) grouped[dateKey] = { opens: 0, clicks: 0, total: 0 };
        grouped[dateKey].opens += Number(log.openRate ?? 0);
        grouped[dateKey].clicks += Number(log.ctr ?? 0);
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

    const recentActivity = await Campaign.find({})
      .sort({ createdAt: 1 })
      .limit(10)
      .populate("userId", "firstName lastName email")
      .select("name createdAt userId");

    res.status(200).json({
      activeCampaigns,
      scheduledCampaigns,
      totalAudience,
      emailsSent: {
        ...emailsSentStats,
        monthlyStats: monthlyEmailStats,
        yAxisMax: 2000,
      },
      campaignPerformance,
      engagementMetrics: {
        openRate: `${emailsSentStats.monthly?.openRate || 0}%`,
        clickRate: `${emailsSentStats.monthly?.clickRate || 0}%`,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
