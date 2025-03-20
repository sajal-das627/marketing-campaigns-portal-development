"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CampaignSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["Criteria-Based", "Real-Time Triggered", "Scheduled"], required: true },
    audience: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Filter", required: true },
    template: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Template", required: true },
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
const Campaign = mongoose_1.default.model("Campaign", CampaignSchema);
exports.default = Campaign;
