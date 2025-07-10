import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("In Progress"),
  completion: integer("completion").notNull().default(0),
  dueDate: text("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  initials: text("initials").notNull(),
  color: text("color").notNull(),
});

export const processes = pgTable("processes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  mermaidCode: text("mermaid_code").notNull(),
  swimlanes: jsonb("swimlanes").$type<string[]>().notNull(),
});

export const requirements = pgTable("requirements", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("Functional"),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("Draft"),
  owner: text("owner").notNull(),
});

export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  steps: text("steps").notNull(),
  expected: text("expected").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("Pending"),
  tester: text("tester").notNull(),
  issue: text("issue"),
});

export const costItems = pgTable("cost_items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  category: text("category").notNull(),
  budgeted: integer("budgeted").notNull(),
  actual: integer("actual").notNull().default(0),
  status: text("status").notNull().default("Not Started"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export const insertProcessSchema = createInsertSchema(processes).omit({
  id: true,
});

export const insertRequirementSchema = createInsertSchema(requirements).omit({
  id: true,
});

export const insertTestCaseSchema = createInsertSchema(testCases).omit({
  id: true,
});

export const insertCostItemSchema = createInsertSchema(costItems).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Process = typeof processes.$inferSelect;
export type InsertProcess = z.infer<typeof insertProcessSchema>;
export type Requirement = typeof requirements.$inferSelect;
export type InsertRequirement = z.infer<typeof insertRequirementSchema>;
export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type CostItem = typeof costItems.$inferSelect;
export type InsertCostItem = z.infer<typeof insertCostItemSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
