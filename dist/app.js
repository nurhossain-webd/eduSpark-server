"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const enrollment_routes_1 = __importDefault(require("./routes/enrollment.routes"));
const app = (0, express_1.default)();
/*
 * Global middleware must come before routes.
 */
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to EduSpark API 🚀",
    });
});
/*
 * API routes
 */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/courses", course_routes_1.default);
app.use("/api/enrollments", enrollment_routes_1.default);
/*
 * Unknown API route
 */
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found.",
    });
});
exports.default = app;
