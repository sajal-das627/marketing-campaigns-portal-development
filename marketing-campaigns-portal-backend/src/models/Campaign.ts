/*import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["criteria-based", "real-time", "scheduled"], required: true },
  audienceFilter: { type: Object },  
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  schedule: {
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], default: "daily" },
    time: { type: String },
  },
  status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign; */

import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  type: { type: String, enum: ["Criteria-Based", "Real-Time Triggered", "Scheduled"], required: true },  
  audience: { type: mongoose.Schema.Types.ObjectId, ref: "Filter", required: true },  
  template: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },  
  schedule: {
    frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true },  
    time: { type: String, required: true },  
    startDate: { type: Date, required: true },  
    endDate: { type: Date },
  },
  status: { type: String, enum: ["Draft", "Scheduled", "Active", "Completed", "On Going", "Completed", "Expired", "Paused"], default: "Draft" },  
  openRate: { type: Number, default: 0 },  
  ctr: { type: Number, default: 0 },  
  delivered: { type: Number, default: 0 },  
  publishedDate: { type: Date, required: true },  
  createdAt: { type: Date, default: Date.now },  
});

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;



