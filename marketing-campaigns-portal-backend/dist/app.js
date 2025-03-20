"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./config/db"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const filterRoutes_1 = __importDefault(require("./routes/filterRoutes"));
const templateRoutes_1 = __importDefault(require("./routes/templateRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Use Morgan for logging HTTP requests
app.use((0, morgan_1.default)("dev"));
// Use Helmet for security headers
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// Request Logging
app.use((0, morgan_1.default)("combined", { stream: { write: (msg) => logger_1.default.info(msg.trim()) } }));
(0, db_1.default)();
app.use("/api/auth", authRoutes_1.default);
app.use("/api/campaigns", campaignRoutes_1.default);
app.use("/api/activity-logs", activityRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.use("/api/filters", filterRoutes_1.default);
app.use("/api/templates", templateRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default); // Register Dashboard Routes
app.use("/api/emails", emailRoutes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
