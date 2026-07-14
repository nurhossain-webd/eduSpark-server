import { Types } from "mongoose";

import Course, { ICourse } from "../models/Course";
import { CreateCourseInput } from "../validations/course.validation";

export async function createCourse(
  payload: CreateCourseInput,
): Promise<ICourse> {
  const course = await Course.create(payload);

  return course;
}

export async function getAllCourses(): Promise<ICourse[]> {
  const courses = await Course.find().sort({
    createdAt: -1,
  });

  return courses;
}

export async function getCourseById(
  courseId: string,
): Promise<ICourse | null> {
  if (!Types.ObjectId.isValid(courseId)) {
    return null;
  }

  const course = await Course.findById(courseId);

  return course;
}

export async function deleteCourseById(
  courseId: string,
): Promise<ICourse | null> {
  if (!Types.ObjectId.isValid(courseId)) {
    return null;
  }

  const deletedCourse = await Course.findByIdAndDelete(courseId);

  return deletedCourse;
}