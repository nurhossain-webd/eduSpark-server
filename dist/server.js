"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./config/env");
async function startServer() {
    try {
        await (0, db_1.default)();
        const server = app_1.default.listen(env_1.env.port, "127.0.0.1", () => {
            console.log(`🚀 Server running on http://localhost:${env_1.env.port}`);
        });
        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                console.error(`❌ Port ${env_1.env.port} is already being used.`);
                process.exit(1);
            }
            console.error("❌ Server error:", error);
            process.exit(1);
        });
    }
    catch (error) {
        console.error("❌ Failed to start EduSpark server:", error);
        process.exit(1);
    }
}
void startServer();
