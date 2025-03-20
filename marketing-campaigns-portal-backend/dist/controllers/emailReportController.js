"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailReports = void 0;
const EmailLog_1 = __importDefault(require("../models/EmailLog"));
const getEmailReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, sortBy = "dateSent", order = "desc", page = "1", limit = "10" } = req.query;
        // Convert pagination values to numbers
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;
        // Construct query for search filtering
        let query = {};
        if (search) {
            query.emailName = { $regex: search, $options: "i" };
        }
        // Fetch data with sorting, pagination, and search filtering
        const emailReports = yield EmailLog_1.default.find(query)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(pageSize);
        // Format response to match UI requirements
        const formattedReports = emailReports.map((report) => ({
            emailName: report.emailName,
            category: report.category,
            dateSent: report.dateSent.toISOString().split("T")[0],
            emailsSent: report.emailsSent.toLocaleString(),
            opens: `${report.opens} (${((report.opens / report.emailsSent) * 100).toFixed(2)}%)`, // ✅ FIXED
            clicks: `${report.clicks} (${((report.clicks / report.emailsSent) * 100).toFixed(2)}%)`,
            unsubscribes: `${report.unsubscribes} (${((report.unsubscribes / report.emailsSent) * 100).toFixed(2)}%)`,
            bounces: `${report.bounces} (${((report.bounces / report.emailsSent) * 100).toFixed(2)}%)`,
        }));
        // Get total count for pagination
        const totalCount = yield EmailLog_1.default.countDocuments(query);
        return res.status(200).json({
            success: true,
            data: formattedReports,
            pagination: {
                total: totalCount,
                page: pageNumber,
                limit: pageSize,
            },
        });
    }
    catch (error) {
        console.error("Error fetching email reports:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getEmailReports = getEmailReports;
