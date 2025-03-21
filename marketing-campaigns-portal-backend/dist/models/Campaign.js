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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/*import mongoose from "mongoose";

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
export default Campaign;*/
const mongoose_1 = __importStar(require("mongoose"));
const CampaignSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["Criteria-Based", "Real-Time Triggered", "Scheduled"], required: true },
    audience: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Filter", required: true },
    template: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Template", required: true },
    status: { type: String, enum: ["Scheduled", "Draft", "Active", "Completed", "On Going", "Expired", "Paused"], required: true },
    createdAt: { type: Date, default: Date.now },
    publishedDate: { type: Date, default: null }, // ✅ Ensure `publishedDate` is optional & defaults to null
    openRate: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    schedule: {
        frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true }, // ✅ Make optional
        time: { type: String, required: true }, // ✅ Make optional
        startDate: { type: Date, required: true }, // ✅ Allow missing startDate for drafts
        endDate: { type: Date, required: true },
    },
});
const Campaign = mongoose_1.default.model("Campaign", CampaignSchema);
exports.default = Campaign;
