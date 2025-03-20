"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailReportController_1 = require("../controllers/emailReportController");
const router = express_1.default.Router();
// GET email reports with optional search, sorting, and pagination
router.get("/email-reports", emailReportController_1.getEmailReports);
exports.default = router;
