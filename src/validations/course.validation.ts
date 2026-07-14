import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters.")
    .max(120, "Title cannot exceed 120 characters."),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must contain at least 10 characters.")
    .max(180, "Short description cannot exceed 180 characters."),

  description: z
    .string()
    .trim()
    .min(30, "Description must contain at least 30 characters."),

  category: z.string().trim().min(2, "Category is required."),

  level: z.enum(["Beginner", "Intermediate", "Advanced"]),

  language: z.string().trim().min(2, "Language is required."),

  price: z
    .number()
    .min(0, "Price cannot be negative."),

  rating: z
    .number()
    .min(0, "Rating cannot be below 0.")
    .max(5, "Rating cannot exceed 5.")
    .optional()
    .default(0),

  students: z
    .number()
    .int("Students must be a whole number.")
    .min(0, "Students cannot be negative.")
    .optional()
    .default(0),

  duration: z.string().trim().min(2, "Duration is required."),

  lessons: z
    .number()
    .int("Lessons must be a whole number.")
    .min(1, "A course must contain at least one lesson."),

  image: z
    .string()
    .trim()
    .url("Please provide a valid image URL."),

  instructor: z.string().trim().min(2, "Instructor name is required."),

  featured: z.boolean().optional().default(false),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;