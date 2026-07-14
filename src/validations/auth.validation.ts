import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters."),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .transform((email: string) => email.toLowerCase()),

    password: z
      .string()
      .min(6, "Password must contain at least 6 characters.")
      .max(100, "Password cannot exceed 100 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;