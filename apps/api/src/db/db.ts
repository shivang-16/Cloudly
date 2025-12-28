import mongoose from "mongoose";

import { logger } from "../logger";

const MONGODB_URI = process.env.CLOUDLY_DB;

const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("CLOUDLY_DB environment variable is not set");
        }
        await mongoose.connect(MONGODB_URI);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;