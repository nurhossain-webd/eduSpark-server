"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
function requireAdmin(req, res, next) {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Authentication is required.",
        });
        return;
    }
    if (req.user.role !== "admin") {
        res.status(403).json({
            success: false,
            message: "Administrator permission is required to manage courses.",
        });
        return;
    }
    next();
}
