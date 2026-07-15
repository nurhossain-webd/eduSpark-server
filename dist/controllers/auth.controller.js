"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const AuthService = __importStar(require("../services/auth.service"));
const auth_validation_1 = require("../validations/auth.validation");
async function registerUser(req, res) {
    try {
        const validation = auth_validation_1.registerSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Please correct the invalid registration information.",
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const user = await AuthService.registerUser(validation.data);
        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: user,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "EMAIL_ALREADY_EXISTS") {
            res.status(409).json({
                success: false,
                message: "An account with this email address already exists.",
            });
            return;
        }
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create the account. Please try again.",
        });
    }
}
async function loginUser(req, res) {
    try {
        const validation = auth_validation_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Please correct the invalid login information.",
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const result = await AuthService.loginUser(validation.data);
        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "INVALID_CREDENTIALS") {
            res.status(401).json({
                success: false,
                message: "Invalid email address or password.",
            });
            return;
        }
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to log in. Please try again.",
        });
    }
}
async function getCurrentUser(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }
        const user = await AuthService.getCurrentUser(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Current user retrieved successfully.",
            data: user,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "USER_NOT_FOUND") {
            res.status(404).json({
                success: false,
                message: "User account not found.",
            });
            return;
        }
        console.error("Current user error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve the current user.",
        });
    }
}
