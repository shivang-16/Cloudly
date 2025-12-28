import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("Cloudly API is running...");
});

// Routes (Placeholder)
// app.use("/api/auth", authRoutes);
// app.use("/api/files", fileRoutes);

export default app;
