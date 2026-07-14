import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getSingleCourse,
} from "../controllers/course.controller";

const router = Router();

router.get("/", getAllCourses);

router.post("/", createCourse);

router.get("/:id", getSingleCourse);

router.delete("/:id", deleteCourse);

export default router;