"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters."),
    email: zod_1.z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .transform((email) => email.toLowerCase()),
    password: zod_1.z
        .string()
        .min(6, "Password must contain at least 6 characters.")
        .max(100, "Password cannot exceed 100 characters."),
    confirmPassword: zod_1.z
        .string()
        .min(1, "Please confirm your password."),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .transform((email) => email.toLowerCase()),
    password: zod_1.z
        .string()
        .min(1, "Password is required."),
});
