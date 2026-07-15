"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            res.status(401).json({
                success: false,
                message: "Authentication token is required.",
            });
            return;
        }
        const [scheme, token] = authorizationHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined.");
            res.status(500).json({
                success: false,
                message: "Authentication configuration is unavailable.",
            });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken.userId ||
            !decodedToken.email ||
            !decodedToken.role) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
            return;
        }
        req.user = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Your login session has expired.",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
            return;
        }
        console.error("Authentication middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to verify authentication.",
        });
    }
}
