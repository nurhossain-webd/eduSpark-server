import { Types } from "mongoose";

import Course from "../models/Course";
import Enrollment, {
  EnrollmentDocument,
} from "../models/Enrollment";

export async function enrollInCourse(
  userId: string,
  courseId: string,
): Promise<EnrollmentDocument> {
  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(courseId)
  ) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const userObjectId = new Types.ObjectId(userId);
  const courseObjectId = new Types.ObjectId(courseId);

  const courseExists = await Course.exists({
    _id: courseObjectId,
  });

  if (!courseExists) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const existingEnrollment = await Enrollment.findOne({
    user: userObjectId,
    course: courseObjectId,
  });

  if (existingEnrollment) {
    throw new Error("ALREADY_ENROLLED");
  }

  const enrollment = await Enrollment.create({
    user: userObjectId,
    course: courseObjectId,
    progress: 0,
    status: "active",
  });

  return enrollment;
}

export async function getUserEnrollments(
  userId: string,
): Promise<EnrollmentDocument[]> {
  if (!Types.ObjectId.isValid(userId)) {
    return [];
  }

  const userObjectId = new Types.ObjectId(userId);

  const enrollments = await Enrollment.find({
    user: userObjectId,
  })
    .populate("course")
    .sort({
      createdAt: -1,
    });

  return enrollments;
}

export async function removeEnrollment(
  enrollmentId: string,
  userId: string,
): Promise<EnrollmentDocument | null> {
  if (
    !Types.ObjectId.isValid(enrollmentId) ||
    !Types.ObjectId.isValid(userId)
  ) {
    return null;
  }

  const enrollmentObjectId =
    new Types.ObjectId(enrollmentId);

  const userObjectId = new Types.ObjectId(userId);

  const deletedEnrollment =
    await Enrollment.findOneAndDelete({
      _id: enrollmentObjectId,
      user: userObjectId,
    });

  return deletedEnrollment;
}