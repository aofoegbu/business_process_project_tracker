import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, Download, Play, PlayCircle, StopCircle, Square, CheckSquare, Diamond } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MermaidDiagram from "./mermaid-diagram";
import { type Process } from "@shared/schema";

interface ProcessDesignerProps {
  projectId: number;
}

export default function ProcessDesigner({ projectId }: ProcessDesignerProps) {
  const { toast } = useToast();
  const [newProcessOpen, setNewProcessOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [processName, setProcessName] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");

  const { data: processes, isLoading } = useQuery<Process[]>({
    queryKey: ["/api/projects", projectId, "processes"],
  });

  const createProcessMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; mermaidCode: string }) => {
      return apiRequest("POST", `/api/projects/${projectId}/processes`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "processes"] });
      setNewProcessOpen(false);
      setProcessName("");
      setProcessDescription("");
      setMermaidCode("");
      toast({ title: "Process created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create process", variant: "destructive" });
    },
  });

  const updateProcessMutation = useMutation({
    mutationFn: async (data: { id: number; mermaidCode: string }) => {
      return apiRequest("PATCH", `/api/processes/${data.id}`, { mermaidCode: data.mermaidCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "processes"] });
      toast({ title: "Process updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update process", variant: "destructive" });
    },
  });

  const defaultMermaidCode = `graph TD
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
    end`;

  const currentProcess = selectedProcess || (processes && processes.length > 0 ? processes[0] : null);
  const currentMermaidCode = currentProcess?.mermaidCode || defaultMermaidCode;

  const handleCreateProcess = () => {
    if (!processName.trim() || !processDescription.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createProcessMutation.mutate({
      name: processName,
      description: processDescription,
      mermaidCode: mermaidCode || defaultMermaidCode,
      swimlanes: ["HR Department", "IT Department", "Facilities", "Management"]
    });
  };

  const handleSaveProcess = () => {
    if (!currentProcess) return;
    
    updateProcessMutation.mutate({
      id: currentProcess.id,
      mermaidCode: currentMermaidCode,
    });
  };

  const handleExportProcess = () => {
    if (!currentProcess) return;
    
    const processData = {
      name: currentProcess.name,
      description: currentProcess.description,
      mermaidCode: currentMermaidCode,
      swimlanes: currentProcess.swimlanes,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(processData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProcess.name.replace(/\s+/g, '_')}_process.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Process exported",
      description: "Process definition downloaded successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Process Designer Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Process Elements</h3>
          <Dialog open={newProcessOpen} onOpenChange={setNewProcessOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Process</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Process Name</label>
                  <Input
                    value={processName}
                    onChange={(e) => setProcessName(e.target.value)}
                    placeholder="Enter process name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={processDescription}
                    onChange={(e) => setProcessDescription(e.target.value)}
                    placeholder="Enter process description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mermaid Code (Optional)</label>
                  <Textarea
                    value={mermaidCode}
                    onChange={(e) => setMermaidCode(e.target.value)}
                    placeholder="Enter Mermaid diagram code"
                    rows={10}
                  />
                </div>
                <Button 
                  onClick={handleCreateProcess} 
                  disabled={createProcessMutation.isPending}
                  className="w-full"
                >
                  {createProcessMutation.isPending ? "Creating..." : "Create Process"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Process Elements */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Start/End</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-move hover:bg-gray-50">
                <PlayCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Start</p>
              </div>
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-move hover:bg-gray-50">
                <StopCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">End</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
            <div className="space-y-2">
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-move hover:bg-gray-50">
                <Square className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Task</p>
              </div>
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-move hover:bg-gray-50">
                <CheckSquare className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Approval</p>
              </div>
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-move hover:bg-gray-50">
                <Diamond className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Decision</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Swimlanes</h4>
            <div className="space-y-2">
              <div className="swimlane-hr">
                <span className="text-blue-600 mr-2">•</span>
                HR Department
              </div>
              <div className="swimlane-it">
                <span className="text-green-600 mr-2">•</span>
                IT Department
              </div>
              <div className="swimlane-manager">
                <span className="text-yellow-600 mr-2">•</span>
                Manager
              </div>
              <div className="swimlane-facilities">
                <span className="text-purple-600 mr-2">•</span>
                Facilities
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Swimlane
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Canvas */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentProcess?.name || "Process Designer"}
            </h3>
            {currentProcess && (
              <p className="text-sm text-gray-600">{currentProcess.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleSaveProcess}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportProcess}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-1" />
              Validate
            </Button>
          </div>
        </div>

        {/* Mermaid Diagram */}
        <Card className="h-full">
          <CardContent className="p-6 h-full">
            {currentProcess ? (
              <div className="h-full overflow-auto">
                <MermaidDiagram 
                  code={currentMermaidCode} 
                  className="w-full min-h-full"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">No process selected</p>
                  <p className="text-sm">Create a new process to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
