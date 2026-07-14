import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
} from "../controllers/course.controller";

const router = Router();

router.get("/", getAllCourses);

router.post("/", createCourse);

router.get("/:id", getSingleCourse);

router.patch("/:id", updateCourse);

router.delete("/:id", deleteCourse);

export default router;