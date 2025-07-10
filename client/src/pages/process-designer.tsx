import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Save, Eye, Code, Layers } from "lucide-react";
import { type Project } from "@shared/schema";
import MermaidDiagram from "@/components/process/mermaid-diagram";

export default function ProcessDesigner() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [mermaidCode, setMermaidCode] = useState(`graph TD
    A[Employee Onboarding Request] --> B{Manager Approval}
    B -->|Approved| C[HR Review & Processing]
    B -->|Rejected| D[Notify Requestor]
    C --> E[System Account Creation]
    E --> F[Equipment Assignment]
    F --> G[Workspace Setup]
    G --> H{All Resources Ready?}
    H -->|Yes| I[Schedule Orientation]
    H -->|No| J[Escalate to IT]
    I --> K[Day 1 Welcome]
    K --> L[30-Day Follow-up]
    L --> M[Onboarding Complete]
    J --> E
    
    subgraph "Human Resources"
        A
        C
        I
        L
        M
    end
    
    subgraph "Management"
        B
        J
    end
    
    subgraph "IT Department"
        E
        F
    end
    
    subgraph "Facilities"
        G
        H
    end
    
    subgraph "New Employee"
        K
        D
    end`);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const templates = [
    {
      name: "Employee Onboarding (BPMN-Lite)",
      description: "Complete employee onboarding with swimlanes, approvals, and stakeholder actions",
      code: `graph TD
    A[New Hire Request] --> B{Manager Approval}
    B -->|Approved| C[HR Profile Creation]
    B -->|Rejected| D[Request Denied]
    C --> E[IT Account Setup]
    E --> F[Equipment Assignment]
    F --> G[Workspace Preparation]
    G --> H[Orientation Scheduling]
    H --> I[First Day Welcome]
    I --> J[30-Day Review]
    J --> K[Onboarding Complete]
    
    subgraph "Human Resources"
        C
        H
        I
        J
        K
    end
    
    subgraph "Management"
        A
        B
        D
    end
    
    subgraph "IT Department"
        E
        F
    end
    
    subgraph "Facilities"
        G
    end`
    },
    {
      name: "Invoice Approval Process",
      description: "Multi-stage financial approval with decision points and escalation",
      code: `graph TD
    A[Invoice Received] --> B[Data Validation]
    B --> C{Amount Check}
    C -->|Under $1000| D[Auto Approve]
    C -->|$1000-$10000| E[Manager Approval]
    C -->|Over $10000| F[Director Approval]
    E -->|Approved| G[Finance Review]
    E -->|Rejected| H[Return to Vendor]
    F -->|Approved| G
    F -->|Rejected| H
    G --> I{Budget Available?}
    I -->|Yes| J[Payment Processing]
    I -->|No| K[Budget Escalation]
    K --> L[CFO Approval]
    L -->|Approved| J
    L -->|Rejected| H
    D --> J
    J --> M[Payment Complete]
    
    subgraph "Accounts Payable"
        A
        B
        C
        D
        J
        M
    end
    
    subgraph "Management"
        E
        F
        L
    end
    
    subgraph "Finance"
        G
        I
        K
    end
    
    subgraph "Vendor"
        H
    end`
    },
    {
      name: "System Access Request",
      description: "IT security approval workflow with role-based access controls",
      code: `graph TD
    A[Access Request] --> B{Request Type}
    B -->|Standard| C[Manager Approval]
    B -->|Privileged| D[Security Review]
    C -->|Approved| E[IT Processing]
    C -->|Rejected| F[Request Denied]
    D --> G{Security Assessment}
    G -->|Low Risk| C
    G -->|High Risk| H[CISO Approval]
    H -->|Approved| E
    H -->|Rejected| F
    E --> I[Account Creation]
    I --> J[Access Provisioning]
    J --> K[User Notification]
    K --> L[Access Granted]
    
    subgraph "Employee"
        A
        K
        L
    end
    
    subgraph "Management"
        C
        F
    end
    
    subgraph "Security Team"
        D
        G
        H
    end
    
    subgraph "IT Operations"
        E
        I
        J
    end`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Process Designer</h1>
              <p className="text-gray-600">Design and visualize business processes with swimlanes, decision points, and workflows</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Left Panel - Templates & Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Process Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {templates.map((template, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => setMermaidCode(template.code)}
                        >
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Mermaid Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={mermaidCode}
                      onChange={(e) => setMermaidCode(e.target.value)}
                      placeholder="Enter Mermaid diagram code..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Center Panel - Diagram Preview */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Process Diagram Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="h-full border rounded-lg p-4 overflow-auto">
                      <MermaidDiagram code={mermaidCode} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}