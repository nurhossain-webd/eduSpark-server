"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseReview = createCourseReview;
const mongoose_1 = require("mongoose");
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const User_1 = __importDefault(require("../models/User"));
async function createCourseReview(courseId, userId, payload) {
    if (!mongoose_1.Types.ObjectId.isValid(courseId) ||
        !mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error("COURSE_NOT_FOUND");
    }
    const courseObjectId = new mongoose_1.Types.ObjectId(courseId);
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const [course, user, enrollment] = await Promise.all([
        Course_1.default.findById(courseObjectId),
        User_1.default.findById(userObjectId),
        Enrollment_1.default.findOne({
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
    const alreadyReviewed = course.reviews.some((review) => review.user?.toString() === userObjectId.toString());
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
    const ratingTotal = course.reviews.reduce((total, review) => total + Number(review.rating), 0);
    course.rating = Number((ratingTotal / course.totalReviews).toFixed(1));
    await course.save();
    return course;
}
