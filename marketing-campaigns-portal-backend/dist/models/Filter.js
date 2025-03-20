"use strict";
/*import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  conditions: { type: Array, required: true }, // Stores AND/OR conditions
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Filter = mongoose.model("Filter", filterSchema);
export default Filter;*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConditionSchema = new mongoose_1.default.Schema({
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    groupId: { type: String, required: false },
});
const FilterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    conditions: [ConditionSchema],
    logicalOperator: { type: String, enum: ["AND", "OR", "BOTH"], required: true },
    estimatedAudience: { type: Number, default: 0 },
    isDraft: { type: Boolean, default: false },
    lastUsed: { type: String, default: "Never" },
    ctr: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
const Filter = mongoose_1.default.model("Filter", FilterSchema);
exports.default = Filter;
