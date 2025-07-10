import { Plus, User, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; dueDate: string }) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setNewProjectOpen(false);
      setProjectName("");
      setProjectDescription("");
      setDueDate("");
      toast({ title: "Project created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  const handleCreateProject = () => {
    if (!projectName.trim() || !projectDescription.trim() || !dueDate) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createProjectMutation.mutate({
      name: projectName,
      description: projectDescription,
      dueDate: dueDate,
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ogelo ProcessFlow</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className={`font-medium pb-4 -mb-4 ${location === '/' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                Dashboard
              </Link>
              <Link href="/process-designer" className={`font-medium pb-4 -mb-4 ${location === '/process-designer' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                Process Designer
              </Link>
              <Link href="/projects" className={`font-medium pb-4 -mb-4 ${location === '/projects' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                Projects
              </Link>
              <Link href="/templates" className={`font-medium pb-4 -mb-4 ${location === '/templates' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                Templates
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="project-name" className="text-sm font-medium">
                      Project Name
                    </label>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="project-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="project-description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="due-date" className="text-sm font-medium">
                      Due Date
                    </label>
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
