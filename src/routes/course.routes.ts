import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
} from "../controllers/course.controller";
import { requireAdmin } from "../middlewares/admin.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/*
 * Public routes
 */
router.get("/", getAllCourses);

router.get("/:id", getSingleCourse);

/*
 * Admin-only routes
 */
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createCourse,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateCourse,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteCourse,
);

export default router;