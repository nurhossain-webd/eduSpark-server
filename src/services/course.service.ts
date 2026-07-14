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