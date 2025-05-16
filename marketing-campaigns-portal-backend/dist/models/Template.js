"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TemplateSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: false },
    type: { type: String, enum: ["Email", "SMS", "Basic", "Designed", "Custom"], required: true },
    category: { type: String, enum: ["Promotional", "Transactional", "Event Based", "Update", "Announcement", "Action", "Product", "Holiday"], required: true },
    tags: [{ type: String }],
    layout: { type: String, enum: ["Single Column", "Two Column", "Custom"], required: false },
    createdAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    lastUsed: { type: Date, default: null },
    favorite: { type: Boolean, default: false },
    content: { type: Object, required: true }, // Stores template design data
    isDeleted: { type: Boolean, default: false }, // ✅ New Field for Soft Delete
    deletedAt: { type: Date, default: null }, // ✅ Timestamp for Deletion
    // ✅ Add versioning field
    version: { type: Number, default: 1 },
    // ✅ Optional opt-out checkbox field
    includeOptOutText: { type: Boolean, default: false }
});
const Template = mongoose_1.default.model("Template", TemplateSchema);
exports.default = Template;
