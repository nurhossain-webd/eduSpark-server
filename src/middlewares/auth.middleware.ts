import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "user" | "admin";
  };
}

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });

      return;
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });

      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined.");

      res.status(500).json({
        success: false,
        message: "Authentication configuration is unavailable.",
      });

      return;
    }

    const decodedToken = jwt.verify(
      token,
      jwtSecret,
    ) as AccessTokenPayload;

    if (
      !decodedToken.userId ||
      !decodedToken.email ||
      !decodedToken.role
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Your login session has expired.",
      });

      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    console.error("Authentication middleware error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to verify authentication.",
    });
  }
}