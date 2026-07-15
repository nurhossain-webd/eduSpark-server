import { Types } from "mongoose";

import Course, {
  ICourseReview,
} from "../models/Course";
import Enrollment from "../models/Enrollment";
import User from "../models/User";
import { CreateReviewInput } from "../validations/review.validation";

export async function createCourseReview(
  courseId: string,
  userId: string,
  payload: CreateReviewInput,
) {
  if (
    !Types.ObjectId.isValid(courseId) ||
    !Types.ObjectId.isValid(userId)
  ) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const courseObjectId = new Types.ObjectId(courseId);
  const userObjectId = new Types.ObjectId(userId);

  const [course, user, enrollment] = await Promise.all([
    Course.findById(courseObjectId),
    User.findById(userObjectId),
    Enrollment.findOne({
      user: userObjectId,
      course: courseObjectId,
    }),
  ]);

  if (!course) {
    throw new Error("COURSE_NOT_FOUND");
  }

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!enrollment) {
    throw new Error("ENROLLMENT_REQUIRED");
  }

  /*
   * Older or manually inserted courses may not contain
   * reviews and totalReviews fields.
   */
  if (!Array.isArray(course.reviews)) {
    course.reviews = [];
  }

  const alreadyReviewed = course.reviews.some(
    (review: ICourseReview) =>
      review.user?.toString() === userObjectId.toString(),
  );

  if (alreadyReviewed) {
    throw new Error("ALREADY_REVIEWED");
  }

  course.reviews.push({
    user: userObjectId,
    studentName: user.name,
    rating: payload.rating,
    comment: payload.comment.trim(),
    createdAt: new Date(),
  });

  course.totalReviews = course.reviews.length;

  const ratingTotal = course.reviews.reduce(
    (
      total: number,
      review: ICourseReview,
    ) => total + Number(review.rating),
    0,
  );

  course.rating = Number(
    (ratingTotal / course.totalReviews).toFixed(1),
  );

  await course.save();

  return course;
}