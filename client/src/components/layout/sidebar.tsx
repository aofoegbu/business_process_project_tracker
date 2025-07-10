import { Folder, FolderOpen, FileText, Plus, Upload, Download, Users, Server, ClipboardCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type Project } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleExportAllReports = () => {
    const reportData = {
      projects: projects || [],
      exportDate: new Date().toISOString(),
      reportType: "Complete Project Report"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Projects_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Reports exported",
      description: "All project reports downloaded successfully.",
    });
  };

  const handleImportDiagram = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt,.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            let diagramData;
            
            if (file.name.endsWith('.json')) {
              diagramData = JSON.parse(content);
            } else {
              diagramData = { mermaidCode: content };
            }
            
            navigator.clipboard.writeText(diagramData.mermaidCode || content).then(() => {
              toast({
                title: "Diagram imported",
                description: "Diagram data copied to clipboard. Navigate to Process Designer to paste.",
              });
            }).catch(() => {
              toast({
                title: "Import successful",
                description: "Diagram ready to use in Process Designer.",
              });
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Could not read the diagram file. Please check the format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0">
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Recent Projects
          </h2>
          <div className="space-y-2">
            {projects?.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${
                  location === `/project/${project.id}` 
                    ? 'bg-blue-50 text-primary' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {location === `/project/${project.id}` ? (
                  <FolderOpen className="w-4 h-4 mr-3" />
                ) : (
                  <Folder className="w-4 h-4 mr-3 text-gray-400" />
                )}
                <span className="text-sm font-medium truncate">{project.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Process Templates
          </h2>
          <div className="space-y-2">
            <Link href="/templates/approval" className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Approval Workflow</span>
            </Link>
            <Link href="/templates/review" className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Review Process</span>
            </Link>
            <Link href="/templates/escalation" className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Escalation Flow</span>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/process-designer" className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Plus className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Create Process</span>
            </Link>
            <button 
              className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center"
              onClick={handleImportDiagram}
            >
              <Upload className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Import Diagram</span>
            </button>
            <button 
              className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center"
              onClick={handleExportAllReports}
            >
              <Download className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Export Reports</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
