import http from "http";
import app from "./app";
import connectDB from "./db/db";

import { logger } from "./logger";

const PORT = 4001; // Explicitly set to 3001 to avoid conflict with frontend (3000)

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        
        server.listen(PORT, () => {
             logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
