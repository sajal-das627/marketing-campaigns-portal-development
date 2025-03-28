"use strict";
/*import mongoose from "mongoose";

const ConditionSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  groupId: { type: String, required: false },
});

const FilterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conditions: [ConditionSchema],
  logicalOperator: { type: String, enum: ["AND", "OR", "BOTH"], required: true },
  estimatedAudience: { type: Number, default: 0 },
  isDraft: { type: Boolean, default: false },
  lastUsed: { type: String, default: "Never" },
  ctr: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Filter = mongoose.model("Filter", FilterSchema);
export default Filter;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CriteriaSchema = new mongoose_1.default.Schema({
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
});
const ConditionGroupSchema = new mongoose_1.default.Schema({
    groupId: { type: String, required: true }, // ✅ Unique Group Identifier
    criteria: [CriteriaSchema], // ✅ Each group has multiple criteria
});
const FilterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    conditions: [ConditionGroupSchema], // ✅ Store groups instead of flat conditions
    logicalOperator: { type: String, enum: ["AND", "OR"], required: true },
    estimatedAudience: { type: Number, default: 0 },
    isDraft: { type: Boolean, default: false },
    lastUsed: { type: String, default: "Never" },
    ctr: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    // ✅ Add customFields as a flexible object (key-value pairs)
    customFields: {
        type: Map,
        of: String, // or `mongoose.Schema.Types.Mixed` for flexibility 
        default: {}
    }
});
const Filter = mongoose_1.default.model("Filter", FilterSchema);
exports.default = Filter;
