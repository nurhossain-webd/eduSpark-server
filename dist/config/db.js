"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
let connectionPromise = null;
async function connectDB() {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        throw new Error("MONGODB_URI is not defined.");
    }
    if (mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default;
    }
    if (!connectionPromise) {
        connectionPromise = mongoose_1.default.connect(mongodbUri, {
            serverSelectionTimeoutMS: 10000,
        });
    }
    try {
        const connection = await connectionPromise;
        console.log(`✅ MongoDB connected: ${connection.connection.name}`);
        return connection;
    }
    catch (error) {
        connectionPromise = null;
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
}
