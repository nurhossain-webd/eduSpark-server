import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "./auth.middleware";

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
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
      message:
        "Administrator permission is required to manage courses.",
    });

    return;
  }

  next();
}
