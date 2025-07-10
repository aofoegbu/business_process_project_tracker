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
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async initializeDefaultData() {
    // Check if data already exists
    const existingProjects = await db.select().from(projects);
    if (existingProjects.length > 0) {
      return; // Data already exists
    }

    // Create default projects
    const defaultProjects = [
      {
        name: "Employee Onboarding",
        description: "Streamlined workflow for new hire integration and documentation",
        status: "In Progress",
        completion: 78,
        dueDate: "2024-12-15"
      },
      {
        name: "Invoice Processing",
        description: "Automated invoice approval and payment workflow",
        status: "Completed", 
        completion: 100,
        dueDate: "2024-11-30"
      },
      {
        name: "System Access Request",
        description: "IT security workflow for new system access requests",
        status: "On Hold",
        completion: 35,
        dueDate: "2025-01-15"
      }
    ];

    const createdProjects = await db.insert(projects).values(defaultProjects).returning();

    // Create default team members
    const defaultMembers = [
      { projectId: createdProjects[0].id, name: "John Doe", role: "Project Manager", initials: "JD", color: "blue" },
      { projectId: createdProjects[0].id, name: "Sarah Adams", role: "Business Analyst", initials: "SA", color: "green" },
      { projectId: createdProjects[0].id, name: "Mike Johnson", role: "Developer", initials: "MJ", color: "purple" },
      { projectId: createdProjects[1].id, name: "Emily Chen", role: "Finance Manager", initials: "EC", color: "yellow" },
      { projectId: createdProjects[1].id, name: "David Smith", role: "Accountant", initials: "DS", color: "red" },
      { projectId: createdProjects[2].id, name: "Lisa Wilson", role: "IT Security", initials: "LW", color: "indigo" },
    ];

    await db.insert(teamMembers).values(defaultMembers);

    // Create default processes
    const defaultProcesses = [
      {
        projectId: createdProjects[0].id,
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
    J --> K[Process Complete]
    
    subgraph "HR Department"
        C
        H
        I
        J
    end
    
    subgraph "IT Department"
        E
        F
    end
    
    subgraph "Facilities"
        G
    end`,
        swimlanes: ["HR Department", "IT Department", "Facilities", "Manager"] as string[]
      },
      {
        projectId: createdProjects[1].id,
        name: "Invoice Approval Workflow",
        description: "Automated invoice processing and approval workflow",
        mermaidCode: `graph TD
    A[Invoice Received] --> B[Validate Invoice]
    B --> C{Amount Check}
    C -->|< $1000| D[Auto Approve]
    C -->|>= $1000| E[Manager Review]
    E --> F{Manager Decision}
    F -->|Approved| G[Finance Review]
    F -->|Rejected| H[Return to Vendor]
    G --> I[Payment Processing]
    D --> I
    I --> J[Payment Complete]`,
        swimlanes: ["Finance", "Management", "Vendors"] as string[]
      }
    ];

    // Insert processes one by one to handle typing issues
    for (const process of defaultProcesses) {
      await db.insert(processes).values(process);
    }

    // Create default requirements
    const defaultRequirements = [
      {
        projectId: createdProjects[0].id,
        code: "REQ-001",
        title: "System Integration with HRIS",
        description: "The onboarding system must integrate with existing HR Information System to automatically pull employee data and update records.",
        type: "Functional",
        priority: "High",
        status: "Approved",
        owner: "Sarah Adams"
      },
      {
        projectId: createdProjects[0].id,
        code: "REQ-002", 
        title: "Multi-level Approval Workflow",
        description: "The system must support configurable approval workflows with multiple levels based on employee role and department.",
        type: "Functional",
        priority: "High",
        status: "In Review",
        owner: "John Doe"
      },
      {
        projectId: createdProjects[0].id,
        code: "REQ-003",
        title: "Performance Requirements",
        description: "The system must process onboarding requests within 24 hours and support 100+ concurrent users.",
        type: "Non-Functional",
        priority: "Medium",
        status: "Draft",
        owner: "Mike Johnson"
      },
      {
        projectId: createdProjects[1].id,
        code: "REQ-004",
        title: "Invoice Validation Rules",
        description: "System must validate invoice format, vendor authorization, and budget availability before approval.",
        type: "Business",
        priority: "High",
        status: "Approved",
        owner: "Emily Chen"
      }
    ];

    await db.insert(requirements).values(defaultRequirements);

    // Create default test cases
    const defaultTestCases = [
      {
        projectId: createdProjects[0].id,
        code: "TC-001",
        title: "New Employee Profile Creation",
        description: "Verify that new employee profiles are created correctly in the system",
        steps: "1. Submit new hire request\n2. Manager approves request\n3. HR creates employee profile\n4. Verify profile data accuracy",
        expected: "Employee profile created with correct information and active status",
        priority: "High",
        status: "Passed",
        tester: "Sarah Adams",
        issue: null
      },
      {
        projectId: createdProjects[0].id,
        code: "TC-002", 
        title: "IT Account Setup Automation",
        description: "Test automated IT account creation and access provisioning",
        steps: "1. HR profile triggers IT setup\n2. IT accounts created\n3. Access permissions assigned\n4. Welcome email sent",
        expected: "IT accounts created with appropriate access levels and welcome email delivered",
        priority: "High",
        status: "Failed",
        tester: "Mike Johnson",
        issue: "Email service integration failing intermittently"
      },
      {
        projectId: createdProjects[0].id,
        code: "TC-003",
        title: "Manager Approval Rejection Flow",
        description: "Test workflow when manager rejects new hire request",
        steps: "1. Submit new hire request\n2. Manager rejects request\n3. Verify rejection notification\n4. Confirm workflow termination",
        expected: "Request marked as rejected, notifications sent, workflow stops",
        priority: "Medium", 
        status: "Pending",
        tester: "John Doe",
        issue: null
      },
      {
        projectId: createdProjects[1].id,
        code: "TC-004",
        title: "Invoice Auto-Approval Under Limit",
        description: "Test automatic approval for invoices under $1000 threshold",
        steps: "1. Submit invoice under $1000\n2. System validates invoice\n3. Auto-approval triggers\n4. Payment processing initiates",
        expected: "Invoice automatically approved and forwarded to payment processing",
        priority: "High",
        status: "Passed",
        tester: "David Smith",
        issue: null
      }
    ];

    await db.insert(testCases).values(defaultTestCases);

    // Create default cost items
    const defaultCostItems = [
      {
        projectId: createdProjects[0].id,
        category: "Development Team",
        budgeted: 25000,
        actual: 22500,
        status: "Under Budget"
      },
      {
        projectId: createdProjects[0].id,
        category: "Infrastructure",
        budgeted: 8000,
        actual: 7500,
        status: "Under Budget"
      },
      {
        projectId: createdProjects[0].id,
        category: "Testing & QA",
        budgeted: 6000,
        actual: 2500,
        status: "In Progress"
      },
      {
        projectId: createdProjects[0].id,
        category: "Training",
        budgeted: 6000,
        actual: 0,
        status: "Not Started"
      },
      {
        projectId: createdProjects[1].id,
        category: "Development Team",
        budgeted: 15000,
        actual: 15000,
        status: "Under Budget"
      },
      {
        projectId: createdProjects[1].id,
        category: "Testing & QA",
        budgeted: 4000,
        actual: 4200,
        status: "Over Budget"
      }
    ];

    await db.insert(costItems).values(defaultCostItems);

    // Create default activities
    const defaultActivities = [
      {
        projectId: createdProjects[0].id,
        type: "Process Update",
        title: "Updated IT Setup Phase",
        description: "Modified IT account creation process to include security clearance validation"
      },
      {
        projectId: createdProjects[0].id,
        type: "Requirements",
        title: "Requirements Approved",
        description: "Business requirements REQ-001 and REQ-002 have been approved by stakeholders"
      },
      {
        projectId: createdProjects[0].id,
        type: "Testing",
        title: "UAT Cases Created", 
        description: "12 test cases added for new hire onboarding workflow validation"
      },
      {
        projectId: createdProjects[1].id,
        type: "Completion",
        title: "Project Completed",
        description: "Invoice processing workflow successfully deployed to production"
      }
    ];

    await db.insert(activities).values(defaultActivities);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return updated || undefined;
  }

  // Team Members
  async getTeamMembers(projectId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.projectId, projectId));
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db.insert(teamMembers).values(insertTeamMember).returning();
    return teamMember;
  }

  // Processes
  async getProcesses(projectId: number): Promise<Process[]> {
    return await db.select().from(processes).where(eq(processes.projectId, projectId));
  }

  async getProcess(id: number): Promise<Process | undefined> {
    const [process] = await db.select().from(processes).where(eq(processes.id, id));
    return process || undefined;
  }

  async createProcess(insertProcess: InsertProcess): Promise<Process> {
    const [process] = await db.insert(processes).values(insertProcess).returning();
    return process;
  }

  async updateProcess(id: number, updates: Partial<Process>): Promise<Process | undefined> {
    const [updated] = await db.update(processes).set(updates).where(eq(processes.id, id)).returning();
    return updated || undefined;
  }

  // Requirements
  async getRequirements(projectId: number): Promise<Requirement[]> {
    return await db.select().from(requirements).where(eq(requirements.projectId, projectId));
  }

  async createRequirement(insertRequirement: InsertRequirement): Promise<Requirement> {
    const [requirement] = await db.insert(requirements).values(insertRequirement).returning();
    return requirement;
  }

  async updateRequirement(id: number, updates: Partial<Requirement>): Promise<Requirement | undefined> {
    const [updated] = await db.update(requirements).set(updates).where(eq(requirements.id, id)).returning();
    return updated || undefined;
  }

  // Test Cases
  async getTestCases(projectId: number): Promise<TestCase[]> {
    return await db.select().from(testCases).where(eq(testCases.projectId, projectId));
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const [testCase] = await db.insert(testCases).values(insertTestCase).returning();
    return testCase;
  }

  async updateTestCase(id: number, updates: Partial<TestCase>): Promise<TestCase | undefined> {
    const [updated] = await db.update(testCases).set(updates).where(eq(testCases.id, id)).returning();
    return updated || undefined;
  }

  // Cost Items
  async getCostItems(projectId: number): Promise<CostItem[]> {
    return await db.select().from(costItems).where(eq(costItems.projectId, projectId));
  }

  async createCostItem(insertCostItem: InsertCostItem): Promise<CostItem> {
    const [costItem] = await db.insert(costItems).values(insertCostItem).returning();
    return costItem;
  }

  async updateCostItem(id: number, updates: Partial<CostItem>): Promise<CostItem | undefined> {
    const [updated] = await db.update(costItems).set(updates).where(eq(costItems.id, id)).returning();
    return updated || undefined;
  }

  // Activities
  async getActivities(projectId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.projectId, projectId));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }
}

export const storage = new DatabaseStorage();
