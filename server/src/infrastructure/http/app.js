import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "../config/env.js";
import { authenticate } from "./middleware/authenticate.js";

export function createExpressApp({
  authRouter,
  examRouter,
  submissionRouter,
  submissionUploadRouter,
  aiRouter,
  evaluationRouter,
}) {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));

  app.use("/api/auth", authRouter);
  app.use("/api/exams", examRouter);
  app.use("/api/submissions", submissionRouter);
  app.use("/api/submissions", submissionUploadRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/evaluations", evaluationRouter);

  app.use("/uploads", authenticate, express.static(path.resolve("uploads")));

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
