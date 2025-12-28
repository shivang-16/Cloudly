"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../logger");
const MONGODB_URI = process.env.CLOUDLY_DB;
const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("CLOUDLY_DB environment variable is not set");
        }
        await mongoose_1.default.connect(MONGODB_URI);
        logger_1.logger.info("MongoDB connected");
    }
    catch (error) {
        logger_1.logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map