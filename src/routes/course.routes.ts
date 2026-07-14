import { Router } from "express";

import {
  createCourse,
  getAllCourses,
} from "../controllers/course.controller";

const router = Router();

router.post("/", createCourse);

router.get("/", getAllCourses);

export default router;