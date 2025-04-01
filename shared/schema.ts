import { pgTable, text, serial, integer, doublePrecision, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Define the game saves table
export const gameSaves = pgTable("game_saves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameState: json("game_state").notNull(),
  lastSaved: timestamp("last_saved").notNull().defaultNow(),
});

export const insertGameSaveSchema = createInsertSchema(gameSaves).pick({
  userId: true,
  gameState: true,
});

// Game state schema for validation
export const resourceSchema = z.object({
  amount: z.number(),
  perSecond: z.number(),
  lastUpdated: z.number(),
});

export const upgradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  cost: z.number(),
  level: z.number(),
  baseEffect: z.number(),
  multiplier: z.number(),
  unlocked: z.boolean(),
});

export const statsSchema = z.object({
  totalResourcesEarned: z.number(),
  totalUpgradesPurchased: z.number(),
  totalTimePlayed: z.number(),
  lastPlayedTimestamp: z.number().optional(),
});

export const gameStateSchema = z.object({
  resources: resourceSchema,
  upgrades: z.array(upgradeSchema),
  stats: statsSchema,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
export type GameSave = typeof gameSaves.$inferSelect;

export type Resource = z.infer<typeof resourceSchema>;
export type Upgrade = z.infer<typeof upgradeSchema>;
export type Stats = z.infer<typeof statsSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
