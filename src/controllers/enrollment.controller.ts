import { Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as EnrollmentService from "../services/enrollment.service";

interface EnrollRequestBody {
  courseId?: unknown;
}

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

export async function enroll(
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

    const requestBody = req.body as EnrollRequestBody;

    if (
      typeof requestBody.courseId !== "string" ||
      !requestBody.courseId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });

      return;
    }

    const enrollment =
      await EnrollmentService.enrollInCourse(
        req.user.userId,
        requestBody.courseId.trim(),
      );

    res.status(201).json({
      success: true,
      message: "Course enrollment completed successfully.",
      data: enrollment,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ALREADY_ENROLLED"
    ) {
      res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "COURSE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });

      return;
    }

    console.error("Enrollment error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to complete course enrollment.",
    });
  }
}

export async function myEnrollments(
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

    const enrollments =
      await EnrollmentService.getUserEnrollments(
        req.user.userId,
      );

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve your enrolled courses.",
    });
  }
}

export async function deleteEnrollment(
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

    const enrollmentId = getStringParameter(req.params.id);

    if (!enrollmentId) {
      res.status(400).json({
        success: false,
        message: "A valid enrollment ID is required.",
      });

      return;
    }

    const deletedEnrollment =
      await EnrollmentService.removeEnrollment(
        enrollmentId,
        req.user.userId,
      );

    if (!deletedEnrollment) {
      res.status(404).json({
        success: false,
        message: "Enrollment not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Enrollment removed successfully.",
      data: deletedEnrollment,
    });
  } catch (error) {
    console.error("Delete enrollment error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove the enrollment.",
    });
  }
}