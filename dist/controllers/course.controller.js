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
exports.createCourse = createCourse;
exports.getAllCourses = getAllCourses;
exports.getSingleCourse = getSingleCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
const CourseService = __importStar(require("../services/course.service"));
const course_validation_1 = require("../validations/course.validation");
function getStringParameter(parameter) {
    if (typeof parameter === "string") {
        return parameter;
    }
    if (Array.isArray(parameter) && parameter.length > 0) {
        return parameter[0] ?? null;
    }
    return null;
}
const updateCourseSchema = course_validation_1.createCourseSchema.partial();
async function createCourse(req, res) {
    try {
        const validation = course_validation_1.createCourseSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Please correct the invalid course information.",
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const course = await CourseService.createCourse(validation.data);
        res.status(201).json({
            success: true,
            message: "Course created successfully.",
            data: course,
        });
    }
    catch (error) {
        console.error("Create course error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create the course.",
        });
    }
}
async function getAllCourses(req, res) {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search
            : "";
        const category = typeof req.query.category === "string"
            ? req.query.category
            : "";
        const level = typeof req.query.level === "string"
            ? req.query.level
            : "";
        const sort = typeof req.query.sort === "string"
            ? req.query.sort
            : "newest";
        const pageValue = typeof req.query.page === "string"
            ? Number(req.query.page)
            : 1;
        const limitValue = typeof req.query.limit === "string"
            ? Number(req.query.limit)
            : 8;
        const page = Number.isFinite(pageValue) && pageValue > 0
            ? Math.floor(pageValue)
            : 1;
        const limit = Number.isFinite(limitValue) && limitValue > 0
            ? Math.floor(limitValue)
            : 8;
        const result = await CourseService.getAllCourses({
            search,
            category,
            level,
            sort,
            page,
            limit,
        });
        res.status(200).json({
            success: true,
            data: result.courses,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve courses.",
        });
    }
}
async function getSingleCourse(req, res) {
    try {
        const courseId = getStringParameter(req.params.id);
        if (!courseId) {
            res.status(400).json({
                success: false,
                message: "A valid course ID is required.",
            });
            return;
        }
        const course = await CourseService.getCourseById(courseId);
        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        console.error("Get single course error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve the course.",
        });
    }
}
async function updateCourse(req, res) {
    try {
        const courseId = getStringParameter(req.params.id);
        if (!courseId) {
            res.status(400).json({
                success: false,
                message: "A valid course ID is required.",
            });
            return;
        }
        const validation = updateCourseSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Please correct the invalid course information.",
                errors: validation.error.flatten().fieldErrors,
            });
            return;
        }
        if (Object.keys(validation.data).length === 0) {
            res.status(400).json({
                success: false,
                message: "Provide at least one course field to update.",
            });
            return;
        }
        const updatedCourse = await CourseService.updateCourse(courseId, validation.data);
        if (!updatedCourse) {
            res.status(404).json({
                success: false,
                message: "Course not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            data: updatedCourse,
        });
    }
    catch (error) {
        console.error("Update course error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update the course.",
        });
    }
}
async function deleteCourse(req, res) {
    try {
        const courseId = getStringParameter(req.params.id);
        if (!courseId) {
            res.status(400).json({
                success: false,
                message: "A valid course ID is required.",
            });
            return;
        }
        const deletedCourse = await CourseService.deleteCourseById(courseId);
        if (!deletedCourse) {
            res.status(404).json({
                success: false,
                message: "Course not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully.",
            data: deletedCourse,
        });
    }
    catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete the course.",
        });
    }
}
