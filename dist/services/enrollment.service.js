"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollInCourse = enrollInCourse;
exports.getUserEnrollments = getUserEnrollments;
exports.removeEnrollment = removeEnrollment;
const mongoose_1 = require("mongoose");
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
async function enrollInCourse(userId, courseId) {
    if (!mongoose_1.Types.ObjectId.isValid(userId) ||
        !mongoose_1.Types.ObjectId.isValid(courseId)) {
        throw new Error("COURSE_NOT_FOUND");
    }
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const courseObjectId = new mongoose_1.Types.ObjectId(courseId);
    const courseExists = await Course_1.default.exists({
        _id: courseObjectId,
    });
    if (!courseExists) {
        throw new Error("COURSE_NOT_FOUND");
    }
    const existingEnrollment = await Enrollment_1.default.findOne({
        user: userObjectId,
        course: courseObjectId,
    });
    if (existingEnrollment) {
        throw new Error("ALREADY_ENROLLED");
    }
    const enrollment = await Enrollment_1.default.create({
        user: userObjectId,
        course: courseObjectId,
        progress: 0,
        status: "active",
    });
    return enrollment;
}
async function getUserEnrollments(userId) {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        return [];
    }
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const enrollments = await Enrollment_1.default.find({
        user: userObjectId,
    })
        .populate("course")
        .sort({
        createdAt: -1,
    });
    return enrollments;
}
async function removeEnrollment(enrollmentId, userId) {
    if (!mongoose_1.Types.ObjectId.isValid(enrollmentId) ||
        !mongoose_1.Types.ObjectId.isValid(userId)) {
        return null;
    }
    const enrollmentObjectId = new mongoose_1.Types.ObjectId(enrollmentId);
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const deletedEnrollment = await Enrollment_1.default.findOneAndDelete({
        _id: enrollmentObjectId,
        user: userObjectId,
    });
    return deletedEnrollment;
}
