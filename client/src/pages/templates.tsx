import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy, Eye, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MermaidDiagram from "@/components/process/mermaid-diagram";

export default function Templates() {
  const { templateType } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const templates = [
    {
      id: "approval",
      name: "Approval Workflow",
      description: "Multi-level approval process with stakeholder involvement and decision points",
      category: "Business Process",
      complexity: "Medium",
      tags: ["Approval", "Management", "Decision"],
      code: `graph TD
    A[Request Submitted] --> B{Manager Review}
    B -->|Approved| C[HR Review]
    B -->|Rejected| D[Return to Requestor]
    C -->|Approved| E[Final Approval]
    C -->|Rejected| D
    E --> F[Process Complete]
    D --> G[Process Cancelled]
    
    subgraph "Requestor"
        A
        D
        G
    end
    
    subgraph "Management"
        B
        E
    end
    
    subgraph "HR Department"
        C
        F
    end`
    },
    {
      id: "review",
      name: "Review Process",
      description: "Document review and approval workflow with collaborative feedback",
      category: "Quality Assurance",
      complexity: "Simple",
      tags: ["Review", "Collaboration", "Quality"],
      code: `graph TD
    A[Document Submitted] --> B[Initial Review]
    B --> C{Quality Check}
    C -->|Pass| D[Peer Review]
    C -->|Fail| E[Return for Revision]
    D --> F{Final Approval}
    F -->|Approved| G[Published]
    F -->|Needs Changes| E
    E --> A
    
    subgraph "Author"
        A
        E
    end
    
    subgraph "Reviewers"
        B
        D
    end
    
    subgraph "Approvers"
        C
        F
        G
    end`
    },
    {
      id: "escalation",
      name: "Escalation Flow",
      description: "Issue escalation process with time-based triggers and notification system",
      category: "Support",
      complexity: "Complex",
      tags: ["Escalation", "Support", "Notification"],
      code: `graph TD
    A[Issue Reported] --> B[Level 1 Support]
    B --> C{Resolved?}
    C -->|Yes| D[Close Ticket]
    C -->|No| E{Time Exceeded?}
    E -->|No| B
    E -->|Yes| F[Level 2 Support]
    F --> G{Resolved?}
    G -->|Yes| D
    G -->|No| H{Critical?}
    H -->|Yes| I[Management Alert]
    H -->|No| J[Level 3 Support]
    I --> K[Executive Review]
    J --> L{Resolved?}
    L -->|Yes| D
    L -->|No| I
    
    subgraph "Support Team"
        B
        F
        J
    end
    
    subgraph "Management"
        I
        K
    end
    
    subgraph "Customer"
        A
        D
    end`
    }
  ];

  const selectedTemplate = templateType ? templates.find(t => t.id === templateType) : null;

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "simple":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "complex":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUseTemplate = (template: any) => {
    // Copy template data to clipboard and navigate to process designer
    const templateData = {
      name: template.name,
      description: template.description,
      mermaidCode: template.code
    };
    
    navigator.clipboard.writeText(template.code).then(() => {
      toast({
        title: "Template copied",
        description: "Process diagram copied to clipboard. Navigate to Process Designer to paste.",
      });
      setLocation("/project/1"); // Navigate to default project
    }).catch(() => {
      toast({
        title: "Template selected",
        description: "Template ready to use in Process Designer.",
      });
      setLocation("/project/1");
    });
  };

  const handleExportTemplate = (template: any) => {
    const templateData = {
      name: template.name,
      description: template.description,
      category: template.category,
      complexity: template.complexity,
      tags: template.tags,
      mermaidCode: template.code,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template exported",
      description: `${template.name} template downloaded successfully.`,
    });
  };

  const handleViewTemplate = (templateId: string) => {
    setLocation(`/templates/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Process Templates</h1>
              <p className="text-gray-600">Ready-to-use business process templates for common workflows</p>
            </div>

            {selectedTemplate ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        {selectedTemplate.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(selectedTemplate.complexity)}>
                          {selectedTemplate.complexity}
                        </Badge>
                        <Badge variant="outline">{selectedTemplate.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUseTemplate(selectedTemplate)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" onClick={() => handleExportTemplate(selectedTemplate)}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Process Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-white">
                      <MermaidDiagram code={selectedTemplate.code} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          {template.name}
                        </CardTitle>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(template)}>
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewTemplate(template.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}