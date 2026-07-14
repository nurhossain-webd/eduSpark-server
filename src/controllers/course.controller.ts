import { Request, Response } from "express";

import { createCourseSchema } from "../validations/course.validation";
import * as CourseService from "../services/course.service";

export async function createCourse(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validation = createCourseSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getAllCourses(
  _: Request,
  res: Response
): Promise<void> {
  try {
    const courses = await CourseService.getAllCourses();

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}