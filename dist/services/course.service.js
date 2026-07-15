"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = createCourse;
exports.getAllCourses = getAllCourses;
exports.getCourseById = getCourseById;
exports.deleteCourseById = deleteCourseById;
exports.updateCourse = updateCourse;
const mongoose_1 = require("mongoose");
const Course_1 = __importDefault(require("../models/Course"));
async function createCourse(payload) {
    const course = await Course_1.default.create(payload);
    return course;
}
async function getAllCourses(options) {
    const { search = "", category = "", level = "", sort = "newest", page = 1, limit = 8, } = options;
    const filter = {};
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
    const sortOptions = {
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
        Course_1.default.find(filter)
            .sort(selectedSort)
            .skip(skip)
            .limit(safeLimit),
        Course_1.default.countDocuments(filter),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCourses / safeLimit));
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
async function getCourseById(courseId) {
    if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
        return null;
    }
    return Course_1.default.findById(courseId);
}
async function deleteCourseById(courseId) {
    if (!mongoose_1.Types.ObjectId.isValid(courseId)) {
        return null;
    }
    return Course_1.default.findByIdAndDelete(courseId);
}
async function updateCourse(id, payload) {
    return await Course_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
}
