"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        throw new Error("MONGODB_URI is not defined in .env");
    }
    try {
        await mongoose_1.default.connect(mongodbUri);
        console.log("✅ MongoDB Connected");
        console.log(`📦 Connected database: ${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}
