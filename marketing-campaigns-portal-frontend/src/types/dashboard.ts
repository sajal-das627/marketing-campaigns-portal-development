export interface EmailRate {
    emailsSent: number;
    openRate: number;
    clickRate: number;
  }
  
  export interface MonthlyStat {
    month: string;
    daily: EmailRate;
    weekly: EmailRate;
    monthly: EmailRate;
  }
  
  export interface EmailsSent {
    daily: number;
    weekly: number;
    monthly: number;
    monthlyStats: MonthlyStat[];
    yAxisMax: number;
  }
  
  export interface CampaignPerformance {
    daily: any[]; // You can define structure if needed
    weekly: any[];
    monthly: any[];
    yAxisMax: number;
  }
  
  export interface EngagementMetrics {
    openRate: string;
    clickRate: string;
  }
  
  export interface RecentActivity {
    _id: string;
    user: string;
    action: string;
    status: string;
    message: string;
    timestamp: string;
    __v: number;
    createdAt: string;
  }
  
  export interface DashboardData {
    activeCampaigns: number;
    scheduledCampaigns: number;
    totalAudience: number;
    emailsSent: EmailsSent;
    campaignPerformance: CampaignPerformance;
    engagementMetrics: EngagementMetrics;
    recentActivity: RecentActivity[];
  }
  