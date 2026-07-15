import { Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as ReviewService from "../services/review.service";
import { createReviewSchema } from "../validations/review.validation";

function getStringParameter(
  parameter: string | string[] | undefined,
): string | null {
  if (typeof parameter === "string") {
    return parameter;
  }

  if (Array.isArray(parameter) && parameter.length > 0) {
    return parameter[0] ?? null;
  }

  return null;
}

export async function createCourseReview(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });

      return;
    }

    const courseId = getStringParameter(req.params.id);

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });

      return;
    }

    const validation = createReviewSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Please correct the invalid review information.",
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    const course = await ReviewService.createCourseReview(
      courseId,
      req.user.userId,
      validation.data,
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: course,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "COURSE_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Course not found.",
        });

        return;
      }

      if (error.message === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "User account not found.",
        });

        return;
      }

      if (error.message === "ENROLLMENT_REQUIRED") {
        res.status(403).json({
          success: false,
          message:
            "You must enroll in this course before submitting a review.",
        });

        return;
      }

      if (error.message === "ALREADY_REVIEWED") {
        res.status(409).json({
          success: false,
          message: "You have already reviewed this course.",
        });

        return;
      }
    }

    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit the review.",
    });
  }
}