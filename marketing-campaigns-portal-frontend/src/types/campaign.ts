import { Types } from 'mongoose';


export interface Schedule{
  frequency?: "Once" | "Daily" | "Weekly" | "Monthly" | "";
  time?: string,
  startDate?: Date;
  endDate?: Date;
}

export interface CampaignData {  
    _id: string;
    name: string;
    type: "Criteria Based" | "Real Time" | "Scheduled" | "";
    audience: Types.ObjectId | null;
    template: Types.ObjectId | null;  
    status: "Draft" | "Scheduled" | "Active" | "On Going" | "Completed" | "Expired" | "Paused";
    publishedDate?: Date;
    createdAt?: Date;
    openRate: number;
    ctr: number;
    delivered: number;
    schedule: Schedule | null;
} 

export interface Audience {
    id: Types.ObjectId; 
    name: string;
    description: string;
    icon: string;
  }

export interface Template {
  id: Types.ObjectId;
  type: "Email" | "SMS" | "Push Notifications";
  title: string;
  created_at: string;
  description: string;
  image: string;
}

// export interface EmailData{
//   clickRate: number;
//   emailsSent: number;
//   openRate: number;
// }

// export interface MonthlyStats{
//   daily: EmailData;
//   monthly: EmailData;
//   weekly: EmailData;
//   month: string;
// }