"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enroll = enroll;
exports.myEnrollments = myEnrollments;
exports.deleteEnrollment = deleteEnrollment;
const EnrollmentService = __importStar(require("../services/enrollment.service"));
function getStringParameter(parameter) {
    if (typeof parameter === "string") {
        return parameter;
    }
    if (Array.isArray(parameter) && parameter.length > 0) {
        return parameter[0] ?? null;
    }
    return null;
}
async function enroll(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }
        const requestBody = req.body;
        if (typeof requestBody.courseId !== "string" ||
            !requestBody.courseId.trim()) {
            res.status(400).json({
                success: false,
                message: "A valid course ID is required.",
            });
            return;
        }
        const enrollment = await EnrollmentService.enrollInCourse(req.user.userId, requestBody.courseId.trim());
        res.status(201).json({
            success: true,
            message: "Course enrollment completed successfully.",
            data: enrollment,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "ALREADY_ENROLLED") {
            res.status(409).json({
                success: false,
                message: "You are already enrolled in this course.",
            });
            return;
        }
        if (error instanceof Error &&
            error.message === "COURSE_NOT_FOUND") {
            res.status(404).json({
                success: false,
                message: "Course not found.",
            });
            return;
        }
        console.error("Enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to complete course enrollment.",
        });
    }
}
async function myEnrollments(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }
        const enrollments = await EnrollmentService.getUserEnrollments(req.user.userId);
        res.status(200).json({
            success: true,
            data: enrollments,
        });
    }
    catch (error) {
        console.error("Get enrollments error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve your enrolled courses.",
        });
    }
}
async function deleteEnrollment(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }
        const enrollmentId = getStringParameter(req.params.id);
        if (!enrollmentId) {
            res.status(400).json({
                success: false,
                message: "A valid enrollment ID is required.",
            });
            return;
        }
        const deletedEnrollment = await EnrollmentService.removeEnrollment(enrollmentId, req.user.userId);
        if (!deletedEnrollment) {
            res.status(404).json({
                success: false,
                message: "Enrollment not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Enrollment removed successfully.",
            data: deletedEnrollment,
        });
    }
    catch (error) {
        console.error("Delete enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to remove the enrollment.",
        });
    }
}
