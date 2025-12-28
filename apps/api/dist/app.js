"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("@clerk/express");
const folder_routes_1 = __importDefault(require("./routes/folder.routes"));
const file_routes_1 = __importDefault(require("./routes/file.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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