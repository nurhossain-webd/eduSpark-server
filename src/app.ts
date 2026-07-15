import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollment.routes";

const app = express();

/*
 * Global middleware must come before routes.
 */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://edu-spark-client.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduSpark API 🚀",
  });
});

/*
 * API routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

/*
 * Unknown API route
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

export default app;