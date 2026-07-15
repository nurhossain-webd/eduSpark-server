"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const review_controller_1 = require("../controllers/review.controller");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/*
 * Public routes
 */
router.get("/", course_controller_1.getAllCourses);
router.get("/:id", course_controller_1.getSingleCourse);
/*
 * Logged-in student route
 */
router.post("/:id/reviews", auth_middleware_1.requireAuth, review_controller_1.createCourseReview);
/*
 * Admin-only routes
 */
router.post("/", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, course_controller_1.createCourse);
router.patch("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, course_controller_1.updateCourse);
router.delete("/:id", auth_middleware_1.requireAuth, admin_middleware_1.requireAdmin, course_controller_1.deleteCourse);
exports.default = router;
