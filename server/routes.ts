import type { Express } from "express";
import dayPlansRouter from "./routes/dayPlans";

export function registerRoutes(app: Express) {
  // Register the dayPlans routes under /api/dayplan
  app.use('/api/dayplan', dayPlansRouter);
}