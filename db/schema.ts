import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const dayPlans = pgTable("day_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  emojis: jsonb("emojis").$type<string[]>().notNull(),
  huiswerk_checked: text("huiswerk_checked").notNull(),
  day_rating: integer("day_rating").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertDayPlanSchema = createInsertSchema(dayPlans);
export const selectDayPlanSchema = createSelectSchema(dayPlans);
export type InsertDayPlan = z.infer<typeof insertDayPlanSchema>;
export type DayPlan = z.infer<typeof selectDayPlanSchema>;
