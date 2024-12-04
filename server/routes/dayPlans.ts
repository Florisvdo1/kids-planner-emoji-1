import { Router } from "express";
import { db } from "../../db";
import { dayPlans } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get today's plan
router.get("/", async (req, res) => {
  try {
    // Get today's date in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const todaysPlan = await db.query.dayPlans.findFirst({
      where: eq(dayPlans.created_at, today)
    });
    
    if (!todaysPlan) {
      // Create a new plan for today
      const newPlan = await db.insert(dayPlans).values({
        morning_emojis: [],
        midday_emojis: [],
        evening_emojis: [],
        homework_completed: false,
        created_at: today,
        updated_at: today
      }).returning();
      
      return res.json(newPlan[0]);
    }
    
    return res.json(todaysPlan);
  } catch (error) {
    console.error('Error fetching day plan:', error);
    res.status(500).json({ error: 'Failed to fetch day plan' });
  }
});

// Update plan
router.put("/", async (req, res) => {
  try {
    const { morning_emojis, midday_emojis, evening_emojis, homework_completed } = req.body;
    
    // Get today's date in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    // Find today's plan
    const existingPlan = await db.query.dayPlans.findFirst({
      where: eq(dayPlans.created_at, today)
    });
    
    if (!existingPlan) {
      // Create new plan if none exists
      const newPlan = await db.insert(dayPlans).values({
        morning_emojis,
        midday_emojis,
        evening_emojis,
        homework_completed,
        created_at: today,
        updated_at: new Date()
      }).returning();
      
      return res.json(newPlan[0]);
    }
    
    // Update existing plan
    const updatedPlan = await db.update(dayPlans)
      .set({
        morning_emojis,
        midday_emojis,
        evening_emojis,
        homework_completed,
        updated_at: new Date()
      })
      .where(eq(dayPlans.id, existingPlan.id))
      .returning();
    
    res.json(updatedPlan[0]);
  } catch (error) {
    console.error('Error updating day plan:', error);
    res.status(500).json({ error: 'Failed to update day plan' });
  }
});

export default router;
