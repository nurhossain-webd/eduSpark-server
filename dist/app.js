"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const enrollment_routes_1 = __importDefault(require("./routes/enrollment.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://edu-spark-client.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
/*
 * Ensure MongoDB is connected before API controllers run.
 * This is required for Vercel's function-based runtime.
 */
app.use(async (_req, res, next) => {
    try {
        await (0, db_1.connectDB)();
        next();
    }
    catch (error) {
        console.error("Database middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed.",
        });
    }
});
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to EduSpark API 🚀",
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/courses", course_routes_1.default);
app.use("/api/enrollments", enrollment_routes_1.default);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found.",
    });
});
exports.default = app;
