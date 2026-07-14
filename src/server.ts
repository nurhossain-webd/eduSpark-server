import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  try {
    await connectDB();

    const server = app.listen(env.port, "127.0.0.1", () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${env.port} is already being used.`);
        process.exit(1);
      }

      console.error("❌ Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start EduSpark server:", error);
    process.exit(1);
  }
}

void startServer();