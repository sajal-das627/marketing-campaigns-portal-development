"use strict";
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
    groupOperator: { type: String, enum: ["AND", "OR"], required: true }, // ✅ Dynamic AND/OR selection for Trigger Filters
    criteria: [CriteriaSchema], // ✅ Each group has multiple criteria
});
const FilterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    conditions: [ConditionGroupSchema], // ✅ Store groups instead of flat conditions
    logicalOperator: { type: String, enum: ["AND", "OR"], required: true }, // ✅ Operator between groups
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
