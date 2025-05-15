//older
// export interface EmailRate {
//     emailsSent: number;
//     openRate: number;
//     clickRate: number;
//   }

export interface Campaigns {
  campaignId: string;
  clickRate: number;
  openRate: number;
}
export interface EmailRate {
    campaigns: Campaigns[];
    emailsSent: number;
  }
//
  export interface MonthlyStat {
    month: string;
    daily: EmailRate;
    weekly: EmailRate;
    monthly: EmailRate;
  }
  
  export interface EmailsSent {
    daily: {clickRate: number, emailsSent: number, openRate: number};
    weekly: {clickRate: number, emailsSent: number, openRate: number};
    monthly: {clickRate: number, emailsSent: number, openRate: number};
    yearly: {clickRate: number, emailsSent: number, openRate: number};
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
    name: string;
    action: string;
    status: string;
    message: string;
    timestamp: string;
    __v: number;
    createdAt: number;
  }

  export interface ActiveCampaigns {
    daily: {count: number, percentage: number};
    weekly: {count: number, percentage: number};
    monthly: {count: number, percentage: number};
  }

  export interface ScheduledCampaigns {
    daily: {count: number, percentage: number};
    weekly: {count: number, percentage: number};
    monthly: {count: number, percentage: number};
  }

  export interface TotalAudience {
    daily: {count: number, percentage: number};
    weekly: {count: number, percentage: number};
    monthly: {count: number, percentage: number};
  }
  export interface DashboardData {
    activeCampaigns: ActiveCampaigns;
    scheduledCampaigns: ScheduledCampaigns;
    totalAudience: TotalAudience;
    emailsSent: EmailsSent;
    campaignPerformance: CampaignPerformance;
    engagementMetrics: EngagementMetrics;
    recentActivity: RecentActivity[];
  }
  