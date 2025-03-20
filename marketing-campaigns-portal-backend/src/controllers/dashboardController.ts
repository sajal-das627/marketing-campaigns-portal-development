import { Request, Response } from "express";
import Campaign from "../models/Campaign";
import Filter from "../models/Filter";
import EmailLog from "../models/EmailLog";
import ActivityLog from "../models/ActivityLog";

// ✅ Get Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Fetch Active Campaigns Count
    const activeCampaigns = await Campaign.countDocuments({ status: "Active" });

    // Fetch Scheduled Campaigns Count
    const scheduledCampaigns = await Campaign.countDocuments({ status: "Scheduled" });

    // Fetch Total Audience Count
    const totalAudience = await Filter.countDocuments();

    // Fetch Emails Sent (Daily, Weekly, Monthly)
    const emailsSentDaily = await EmailLog.countDocuments({ dateSent: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const emailsSentWeekly = await EmailLog.countDocuments({ dateSent: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    const emailsSentMonthly = await EmailLog.countDocuments({ dateSent: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

    // Fetch Open Rate & Click Rate (Last 30 Days)
    const emailLogs = await EmailLog.find({ dateSent: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const totalEmails = emailLogs.length;
    const totalOpens = emailLogs.reduce((sum, log) => sum + log.opens, 0);  // ✅ Fixed
    const totalClicks = emailLogs.reduce((sum, log) => sum + log.clicks, 0); // ✅ Fixed
    
    const openRate = totalEmails ? ((totalOpens / totalEmails) * 100).toFixed(2) : "0";
    const clickRate = totalEmails ? ((totalClicks / totalEmails) * 100).toFixed(2) : "0";

    // Fetch Recent Activity (Last 10 Actions)
    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);

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
        openRate: `${openRate}%`,  // ✅ Fixed template string
        clickRate: `${clickRate}%`, // ✅ Fixed template string
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
