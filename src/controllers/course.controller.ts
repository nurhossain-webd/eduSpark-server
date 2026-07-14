import { Request, Response } from "express";

import * as CourseService from "../services/course.service";
import { createCourseSchema } from "../validations/course.validation";

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

    const course = await CourseService.createCourse(validation.data);

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
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const courses = await CourseService.getAllCourses();

    res.status(200).json({
      success: true,
      data: courses,
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
    const courseId = req.params.id;

    const course = await CourseService.getCourseById(courseId);

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

export async function deleteCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const courseId = req.params.id;

    const deletedCourse =
      await CourseService.deleteCourseById(courseId);

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