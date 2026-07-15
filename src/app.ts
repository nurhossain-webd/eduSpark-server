import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import morgan from "morgan";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollment.routes";

const app = express();

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/*
 * Ensure MongoDB is connected before API controllers run.
 * This is required for Vercel's function-based runtime.
 */
app.use(
  async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error("Database middleware error:", error);

      res.status(500).json({
        success: false,
        message: "Database connection failed.",
      });
    }
  },
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduSpark API 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

export default app;