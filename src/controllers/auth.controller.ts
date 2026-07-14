import { Request, Response } from "express";

import * as AuthService from "../services/auth.service";
import {
  loginSchema,
  registerSchema,
} from "../validations/auth.validation";

export async function registerUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message:
          "Please correct the invalid registration information.",
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    const user = await AuthService.registerUser(
      validation.data,
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message:
          "An account with this email address already exists.",
      });

      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message:
        "Unable to create the account. Please try again.",
    });
  }
}

export async function loginUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message:
          "Please correct the invalid login information.",
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    const result = await AuthService.loginUser(
      validation.data,
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
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