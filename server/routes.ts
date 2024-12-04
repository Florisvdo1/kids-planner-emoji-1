import type { Express } from "express";
import { db } from "../db";
import { dayPlans } from "../db/schema";

export function registerRoutes(app: Express) {
  // Save day plan
  app.post('/api/plans', async (req, res) => {
    try {
      const result = await db.insert(dayPlans).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save plan' });
    }
  });

  // Get day plans
  app.get('/api/plans', async (req, res) => {
    try {
      const results = await db.select().from(dayPlans);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });
}
