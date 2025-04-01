import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the departments
export const departmentEnum = z.enum([
  "MACRODATA_REFINEMENT",
  "OPTICS_AND_DESIGN",
  "MIND_SECURITY",
  "DATA_CONTROL",
  "UNASSIGNED"
]);

// Define the employee table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  department: text("department").notNull().default("UNASSIGNED"),
  job: text("job").notNull().default(""),
  isAdmin: integer("is_admin").notNull().default(0),
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  name: true,
  code: true,
  department: true,
  job: true,
  isAdmin: true,
});

export const updateEmployeeSchema = createInsertSchema(employees).pick({
  name: true,
  code: true,
  department: true,
  job: true,
  isAdmin: true,
});

// Schema for validation
export const employeeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(5, "Code must be 5 digits").max(5, "Code must be 5 digits").regex(/^\d+$/, "Code must contain only digits"),
  department: departmentEnum,
  job: z.string(),
  isAdmin: z.number().default(0),
});

export const adminCredentialsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(5, "Code must be 5 digits").max(5, "Code must be 5 digits").regex(/^\d+$/, "Code must contain only digits"),
});

// Types
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type Department = z.infer<typeof departmentEnum>;
export type AdminCredentials = z.infer<typeof adminCredentialsSchema>;
