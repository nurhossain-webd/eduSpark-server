import { FilterQuery, SortOrder, Types } from "mongoose";

import Course, { ICourse } from "../models/Course";
import { CreateCourseInput } from "../validations/course.validation";

export interface CourseQueryOptions {
  search?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCourses {
  courses: ICourse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCourses: number;
    limit: number;
  };
}

export async function createCourse(
  payload: CreateCourseInput,
): Promise<ICourse> {
  const course = await Course.create(payload);

  return course;
}

export async function getAllCourses(
  options: CourseQueryOptions,
): Promise<PaginatedCourses> {
  const {
    search = "",
    category = "",
    level = "",
    sort = "newest",
    page = 1,
    limit = 8,
  } = options;

  const filter: FilterQuery<ICourse> = {};

  if (search.trim()) {
    filter.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        instructor: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (category.trim()) {
    filter.category = category.trim();
  }

  if (level.trim()) {
    filter.level = level.trim();
  }

  const sortOptions: Record<string, Record<string, SortOrder>> = {
    newest: {
      createdAt: -1,
    },
    oldest: {
      createdAt: 1,
    },
    "price-low": {
      price: 1,
    },
    "price-high": {
      price: -1,
    },
    rating: {
      rating: -1,
    },
    popular: {
      students: -1,
    },
  };

  const selectedSort = sortOptions[sort] ?? sortOptions.newest;

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const skip = (safePage - 1) * safeLimit;

  const [courses, totalCourses] = await Promise.all([
    Course.find(filter)
      .sort(selectedSort)
      .skip(skip)
      .limit(safeLimit),
    Course.countDocuments(filter),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalCourses / safeLimit),
  );

  return {
    courses,
    pagination: {
      currentPage: safePage,
      totalPages,
      totalCourses,
      limit: safeLimit,
    },
  };
}

export async function getCourseById(
  courseId: string,
): Promise<ICourse | null> {
  if (!Types.ObjectId.isValid(courseId)) {
    return null;
  }

  return Course.findById(courseId);
}

export async function deleteCourseById(
  courseId: string,
): Promise<ICourse | null> {
  if (!Types.ObjectId.isValid(courseId)) {
    return null;
  }

  return Course.findByIdAndDelete(courseId);
}