"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db/db"));
const PORT = 3001; // Explicitly set to 3001 to avoid conflict with frontend (3000)
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        await (0, db_1.default)();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map