import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
} from "../controllers/course.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/*
 * Public routes
 */
router.get("/", getAllCourses);

router.get("/:id", getSingleCourse);

/*
 * Protected routes
 */
router.post("/", requireAuth, createCourse);

router.patch("/:id", requireAuth, updateCourse);

router.delete("/:id", requireAuth, deleteCourse);

export default router;