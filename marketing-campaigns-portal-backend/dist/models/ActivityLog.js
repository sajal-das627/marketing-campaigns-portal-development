"use strict";
/*import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  status: { type: String, enum: ["success", "warning", "error"], required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ActivityLogSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    actionType: { type: String, required: true }, // Example: "Created Campaign", "Updated Filter"
    description: { type: String, required: true }, // Example: "Spring Sale Campaign Created"
    createdAt: { type: Date, default: Date.now },
});
const ActivityLog = mongoose_1.default.model("ActivityLog", ActivityLogSchema);
exports.default = ActivityLog;
