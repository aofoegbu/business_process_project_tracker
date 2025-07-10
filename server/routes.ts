import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertTeamMemberSchema, 
  insertProcessSchema, 
  insertRequirementSchema, 
  insertTestCaseSchema, 
  insertCostItemSchema, 
  insertActivitySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const project = insertProjectSchema.parse(req.body);
      const created = await storage.createProject(project);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateProject(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(updated);
  });

  // Team Members
  app.get("/api/projects/:projectId/team-members", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const members = await storage.getTeamMembers(projectId);
    res.json(members);
  });

  app.post("/api/projects/:projectId/team-members", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const member = insertTeamMemberSchema.parse({ ...req.body, projectId });
      const created = await storage.createTeamMember(member);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  // Processes
  app.get("/api/projects/:projectId/processes", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const processes = await storage.getProcesses(projectId);
    res.json(processes);
  });

  app.get("/api/processes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const process = await storage.getProcess(id);
    if (!process) {
      return res.status(404).json({ message: "Process not found" });
    }
    res.json(process);
  });

  app.post("/api/projects/:projectId/processes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const process = insertProcessSchema.parse({ ...req.body, projectId });
      const created = await storage.createProcess(process);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid process data" });
    }
  });

  app.patch("/api/processes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateProcess(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Process not found" });
    }
    res.json(updated);
  });

  // Requirements
  app.get("/api/projects/:projectId/requirements", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const requirements = await storage.getRequirements(projectId);
    res.json(requirements);
  });

  app.post("/api/projects/:projectId/requirements", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const requirement = insertRequirementSchema.parse({ ...req.body, projectId });
      const created = await storage.createRequirement(requirement);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid requirement data" });
    }
  });

  app.patch("/api/requirements/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateRequirement(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Requirement not found" });
    }
    res.json(updated);
  });

  // Test Cases
  app.get("/api/projects/:projectId/test-cases", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const testCases = await storage.getTestCases(projectId);
    res.json(testCases);
  });

  app.post("/api/projects/:projectId/test-cases", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const testCase = insertTestCaseSchema.parse({ ...req.body, projectId });
      const created = await storage.createTestCase(testCase);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid test case data" });
    }
  });

  app.patch("/api/test-cases/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateTestCase(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Test case not found" });
    }
    res.json(updated);
  });

  // Cost Items
  app.get("/api/projects/:projectId/cost-items", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const costItems = await storage.getCostItems(projectId);
    res.json(costItems);
  });

  app.post("/api/projects/:projectId/cost-items", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const costItem = insertCostItemSchema.parse({ ...req.body, projectId });
      const created = await storage.createCostItem(costItem);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid cost item data" });
    }
  });

  app.patch("/api/cost-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await storage.updateCostItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Cost item not found" });
    }
    res.json(updated);
  });

  // Activities
  app.get("/api/projects/:projectId/activities", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const activities = await storage.getActivities(projectId);
    res.json(activities);
  });

  app.post("/api/projects/:projectId/activities", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const activity = insertActivitySchema.parse({ ...req.body, projectId });
      const created = await storage.createActivity(activity);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  // Initialize database with dummy data
  app.post("/api/init-db", async (_req, res) => {
    try {
      await (storage as any).initializeDefaultData();
      res.json({ message: "Database initialized successfully" });
    } catch (error: any) {
      console.error("Database initialization error:", error);
      res.status(500).json({ message: "Failed to initialize database", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
