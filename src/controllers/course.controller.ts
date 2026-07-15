import { Request, Response } from "express";

import * as CourseService from "../services/course.service";
import { createCourseSchema } from "../validations/course.validation";

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

const updateCourseSchema = createCourseSchema.partial();

export async function createCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validation = createCourseSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Please correct the invalid course information.",
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    const course = await CourseService.createCourse(
      validation.data,
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create the course.",
    });
  }
}

export async function getAllCourses(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : "";

    const level =
      typeof req.query.level === "string"
        ? req.query.level
        : "";

    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : "newest";

    const pageValue =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limitValue =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 8;

    const page =
      Number.isFinite(pageValue) && pageValue > 0
        ? Math.floor(pageValue)
        : 1;

    const limit =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.floor(limitValue)
        : 8;

    const result = await CourseService.getAllCourses({
      search,
      category,
      level,
      sort,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.courses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve courses.",
    });
  }
}

export async function getSingleCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const courseId = getStringParameter(req.params.id);

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });

      return;
    }

    const course = await CourseService.getCourseById(
      courseId,
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get single course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve the course.",
    });
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const courseId = getStringParameter(req.params.id);

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });

      return;
    }

    const validation = updateCourseSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Please correct the invalid course information.",
        errors: validation.error.flatten().fieldErrors,
      });

      return;
    }

    if (Object.keys(validation.data).length === 0) {
      res.status(400).json({
        success: false,
        message: "Provide at least one course field to update.",
      });

      return;
    }

    const updatedCourse =
      await CourseService.updateCourse(
        courseId,
        validation.data,
      );

    if (!updatedCourse) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update the course.",
    });
  }
}

export async function deleteCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const courseId = getStringParameter(req.params.id);

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });

      return;
    }

    const deletedCourse =
      await CourseService.deleteCourseById(
        courseId,
      );

    if (!deletedCourse) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
      data: deletedCourse,
    });
  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete the course.",
    });
  }
}