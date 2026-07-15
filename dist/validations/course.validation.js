"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, "Title must contain at least 3 characters.")
        .max(120, "Title cannot exceed 120 characters."),
    shortDescription: zod_1.z
        .string()
        .trim()
        .min(10, "Short description must contain at least 10 characters.")
        .max(180, "Short description cannot exceed 180 characters."),
    description: zod_1.z
        .string()
        .trim()
        .min(30, "Description must contain at least 30 characters."),
    category: zod_1.z.string().trim().min(2, "Category is required."),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]),
    language: zod_1.z.string().trim().min(2, "Language is required."),
    price: zod_1.z
        .number()
        .min(0, "Price cannot be negative."),
    rating: zod_1.z
        .number()
        .min(0, "Rating cannot be below 0.")
        .max(5, "Rating cannot exceed 5.")
        .optional()
        .default(0),
    students: zod_1.z
        .number()
        .int("Students must be a whole number.")
        .min(0, "Students cannot be negative.")
        .optional()
        .default(0),
    duration: zod_1.z.string().trim().min(2, "Duration is required."),
    lessons: zod_1.z
        .number()
        .int("Lessons must be a whole number.")
        .min(1, "A course must contain at least one lesson."),
    image: zod_1.z
        .string()
        .trim()
        .url("Please provide a valid image URL."),
    instructor: zod_1.z.string().trim().min(2, "Instructor name is required."),
    featured: zod_1.z.boolean().optional().default(false),
});
