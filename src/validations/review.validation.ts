import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5."),

  comment: z
    .string()
    .trim()
    .min(10, "Review must contain at least 10 characters.")
    .max(500, "Review cannot exceed 500 characters."),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;