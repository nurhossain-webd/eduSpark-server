import { Router } from "express";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", requireAuth, getCurrentUser);

export default router;