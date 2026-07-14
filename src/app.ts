import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Welcome to EduSpark API 🚀",
  });
});

export default app;