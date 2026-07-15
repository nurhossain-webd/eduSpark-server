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
exports.createCourseReview = createCourseReview;
const ReviewService = __importStar(require("../services/review.service"));
const review_validation_1 = require("../validations/review.validation");
function getStringParameter(parameter) {
    if (typeof parameter === "string") {
        return parameter;
    }
    if (Array.isArray(parameter) && parameter.length > 0) {
        return parameter[0] ?? null;
    }
    return null;
}
async function createCourseReview(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication is required.",
            });
            return;
        }
        const courseId = getStringParameter(req.params.id);
        if (!courseId) {
            res.status(400).json({
                success: false,
                message: "A valid course ID is required.",
            });
            return;
        }
        const validation = review_validation_1.createReviewSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Please correct the invalid review information.",
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const course = await ReviewService.createCourseReview(courseId, req.user.userId, validation.data);
        res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: course,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "COURSE_NOT_FOUND") {
                res.status(404).json({
                    success: false,
                    message: "Course not found.",
                });
                return;
            }
            if (error.message === "USER_NOT_FOUND") {
                res.status(404).json({
                    success: false,
                    message: "User account not found.",
                });
                return;
            }
            if (error.message === "ENROLLMENT_REQUIRED") {
                res.status(403).json({
                    success: false,
                    message: "You must enroll in this course before submitting a review.",
                });
                return;
            }
            if (error.message === "ALREADY_REVIEWED") {
                res.status(409).json({
                    success: false,
                    message: "You have already reviewed this course.",
                });
                return;
            }
        }
        console.error("Create review error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to submit the review.",
        });
    }
}
