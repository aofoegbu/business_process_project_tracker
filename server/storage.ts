import {
  projects, teamMembers, processes, requirements, testCases, costItems, activities,
  type Project, type InsertProject,
  type TeamMember, type InsertTeamMember,
  type Process, type InsertProcess,
  type Requirement, type InsertRequirement,
  type TestCase, type InsertTestCase,
  type CostItem, type InsertCostItem,
  type Activity, type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  
  // Team Members
  getTeamMembers(projectId: number): Promise<TeamMember[]>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  
  // Processes
  getProcesses(projectId: number): Promise<Process[]>;
  getProcess(id: number): Promise<Process | undefined>;
  createProcess(process: InsertProcess): Promise<Process>;
  updateProcess(id: number, process: Partial<Process>): Promise<Process | undefined>;
  
  // Requirements
  getRequirements(projectId: number): Promise<Requirement[]>;
  createRequirement(requirement: InsertRequirement): Promise<Requirement>;
  updateRequirement(id: number, requirement: Partial<Requirement>): Promise<Requirement | undefined>;
  
  // Test Cases
  getTestCases(projectId: number): Promise<TestCase[]>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  updateTestCase(id: number, testCase: Partial<TestCase>): Promise<TestCase | undefined>;
  
  // Cost Items
  getCostItems(projectId: number): Promise<CostItem[]>;
  createCostItem(costItem: InsertCostItem): Promise<CostItem>;
  updateCostItem(id: number, costItem: Partial<CostItem>): Promise<CostItem | undefined>;
  
  // Activities
  getActivities(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();
  private teamMembers: Map<number, TeamMember> = new Map();
  private processes: Map<number, Process> = new Map();
  private requirements: Map<number, Requirement> = new Map();
  private testCases: Map<number, TestCase> = new Map();
  private costItems: Map<number, CostItem> = new Map();
  private activities: Map<number, Activity> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default project
    const project: Project = {
      id: 1,
      name: "Employee Onboarding",
      description: "Streamlined workflow for new hire integration and documentation",
      status: "In Progress",
      completion: 78,
      dueDate: "2024-12-15",
      createdAt: new Date(),
    };
    this.projects.set(1, project);

    // Create default team members
    const members: TeamMember[] = [
      { id: 1, projectId: 1, name: "John Doe", role: "Project Manager", initials: "JD", color: "blue" },
      { id: 2, projectId: 1, name: "Sarah Adams", role: "Business Analyst", initials: "SA", color: "green" },
      { id: 3, projectId: 1, name: "Mike Johnson", role: "Developer", initials: "MJ", color: "purple" },
    ];
    members.forEach(m => this.teamMembers.set(m.id, m));

    // Create default process
    const process: Process = {
      id: 1,
      projectId: 1,
      name: "Employee Onboarding Process",
      description: "Complete workflow for new employee integration",
      mermaidCode: `graph TD
        A[New Hire Request] --> B{Manager Approval}
        B -->|Approved| C[HR Creates Profile]
        B -->|Rejected| D[Request Denied]
        C --> E[IT Account Setup]
        E --> F[Equipment Assignment]
        F --> G[Workspace Preparation]
        G --> H[Orientation Scheduling]
        H --> I[First Day Checklist]
        I --> J[30-Day Review]
        J --> K[Process Complete]`,
      swimlanes: ["HR Department", "IT Department", "Facilities", "Manager"],
    };
    this.processes.set(1, process);

    this.currentId = 4;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      ...insertProject,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  // Team Members
  async getTeamMembers(projectId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(m => m.projectId === projectId);
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const teamMember: TeamMember = {
      ...insertTeamMember,
      id: this.currentId++,
    };
    this.teamMembers.set(teamMember.id, teamMember);
    return teamMember;
  }

  // Processes
  async getProcesses(projectId: number): Promise<Process[]> {
    return Array.from(this.processes.values()).filter(p => p.projectId === projectId);
  }

  async getProcess(id: number): Promise<Process | undefined> {
    return this.processes.get(id);
  }

  async createProcess(insertProcess: InsertProcess): Promise<Process> {
    const process: Process = {
      ...insertProcess,
      id: this.currentId++,
    };
    this.processes.set(process.id, process);
    return process;
  }

  async updateProcess(id: number, updates: Partial<Process>): Promise<Process | undefined> {
    const process = this.processes.get(id);
    if (!process) return undefined;
    
    const updated = { ...process, ...updates };
    this.processes.set(id, updated);
    return updated;
  }

  // Requirements
  async getRequirements(projectId: number): Promise<Requirement[]> {
    return Array.from(this.requirements.values()).filter(r => r.projectId === projectId);
  }

  async createRequirement(insertRequirement: InsertRequirement): Promise<Requirement> {
    const requirement: Requirement = {
      ...insertRequirement,
      id: this.currentId++,
    };
    this.requirements.set(requirement.id, requirement);
    return requirement;
  }

  async updateRequirement(id: number, updates: Partial<Requirement>): Promise<Requirement | undefined> {
    const requirement = this.requirements.get(id);
    if (!requirement) return undefined;
    
    const updated = { ...requirement, ...updates };
    this.requirements.set(id, updated);
    return updated;
  }

  // Test Cases
  async getTestCases(projectId: number): Promise<TestCase[]> {
    return Array.from(this.testCases.values()).filter(t => t.projectId === projectId);
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const testCase: TestCase = {
      ...insertTestCase,
      id: this.currentId++,
    };
    this.testCases.set(testCase.id, testCase);
    return testCase;
  }

  async updateTestCase(id: number, updates: Partial<TestCase>): Promise<TestCase | undefined> {
    const testCase = this.testCases.get(id);
    if (!testCase) return undefined;
    
    const updated = { ...testCase, ...updates };
    this.testCases.set(id, updated);
    return updated;
  }

  // Cost Items
  async getCostItems(projectId: number): Promise<CostItem[]> {
    return Array.from(this.costItems.values()).filter(c => c.projectId === projectId);
  }

  async createCostItem(insertCostItem: InsertCostItem): Promise<CostItem> {
    const costItem: CostItem = {
      ...insertCostItem,
      id: this.currentId++,
    };
    this.costItems.set(costItem.id, costItem);
    return costItem;
  }

  async updateCostItem(id: number, updates: Partial<CostItem>): Promise<CostItem | undefined> {
    const costItem = this.costItems.get(id);
    if (!costItem) return undefined;
    
    const updated = { ...costItem, ...updates };
    this.costItems.set(id, updated);
    return updated;
  }

  // Activities
  async getActivities(projectId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(a => a.projectId === projectId);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      ...insertActivity,
      id: this.currentId++,
      timestamp: new Date(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
