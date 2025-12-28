import http from "http";
import app from "./app";
import connectDB from "./db/db";

const PORT = 3001; // Explicitly set to 3001 to avoid conflict with frontend (3000)

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        
        server.listen(PORT, () => {
             console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
