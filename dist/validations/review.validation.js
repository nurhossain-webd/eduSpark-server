"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int("Rating must be a whole number.")
        .min(1, "Rating must be at least 1.")
        .max(5, "Rating cannot exceed 5."),
    comment: zod_1.z
        .string()
        .trim()
        .min(10, "Review must contain at least 10 characters.")
        .max(500, "Review cannot exceed 500 characters."),
});
