"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmailLogSchema = new mongoose_1.default.Schema({
    emailName: { type: String, required: true },
    category: { type: String, required: true }, // E.g., "December News"
    dateSent: { type: Date, required: true },
    emailsSent: { type: Number, required: true },
    opens: { type: Number, required: true },
    clicks: { type: Number, required: true },
    unsubscribes: { type: Number, required: true },
    bounces: { type: Number, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("EmailLog", EmailLogSchema);
