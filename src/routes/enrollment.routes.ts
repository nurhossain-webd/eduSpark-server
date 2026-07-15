import { Router } from "express";

import {
  deleteEnrollment,
  enroll,
  myEnrollments,
} from "../controllers/enrollment.controller";

import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, enroll);

router.get("/my", requireAuth, myEnrollments);

router.delete(
  "/:id",
  requireAuth,
  deleteEnrollment,
);

export default router;