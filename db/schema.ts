import { pgTable, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const dayPlans = pgTable("day_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  morning_emojis: jsonb("morning_emojis").$type<string[]>().notNull().default([]),
  midday_emojis: jsonb("midday_emojis").$type<string[]>().notNull().default([]),
  evening_emojis: jsonb("evening_emojis").$type<string[]>().notNull().default([]),
  homework_completed: boolean("homework_completed").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Define the schemas for validation
export const insertDayPlanSchema = createInsertSchema(dayPlans);
export const selectDayPlanSchema = createSelectSchema(dayPlans);

// Export types for TypeScript usage
export type InsertDayPlan = z.infer<typeof insertDayPlanSchema>;
export type DayPlan = z.infer<typeof selectDayPlanSchema>;
