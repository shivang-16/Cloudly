"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("@clerk/express");
const logger_1 = require("./logger");
const folder_routes_1 = __importDefault(require("./routes/folder.routes"));
const file_routes_1 = __importDefault(require("./routes/file.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const express_winston_1 = __importDefault(require("express-winston"));
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logging
app.use(express_winston_1.default.logger({
    winstonInstance: logger_1.logger,
    statusLevels: true, // Output different log levels for different status codes
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));
// Clerk Middleware - adds auth context to all requests
app.use((0, express_2.clerkMiddleware)());
// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Cloudly API is running...",
        version: "1.0.0"
    });
});
// Routes
app.use("/api/folders", folder_routes_1.default);
app.use("/api/files", file_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map