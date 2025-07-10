import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FolderOutput, FileText, Share } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Requirement } from "@shared/schema";

interface RequirementsManagerProps {
  projectId: number;
}

export default function RequirementsManager({ projectId }: RequirementsManagerProps) {
  const { toast } = useToast();
  const [newRequirementOpen, setNewRequirementOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Functional");
  const [priority, setPriority] = useState("Medium");
  const [owner, setOwner] = useState("");

  const { data: requirements, isLoading } = useQuery<Requirement[]>({
    queryKey: ["/api/projects", projectId, "requirements"],
  });

  const createRequirementMutation = useMutation({
    mutationFn: async (data: {
      code: string;
      title: string;
      description: string;
      type: string;
      priority: string;
      owner: string;
    }) => {
      return apiRequest("POST", `/api/projects/${projectId}/requirements`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "requirements"] });
      setNewRequirementOpen(false);
      resetForm();
      toast({ title: "Requirement created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create requirement", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setCode("");
    setTitle("");
    setDescription("");
    setType("Functional");
    setPriority("Medium");
    setOwner("");
  };

  const handleCreateRequirement = () => {
    if (!code.trim() || !title.trim() || !description.trim() || !owner.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createRequirementMutation.mutate({
      code,
      title,
      description,
      type,
      priority,
      owner,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "in review":
        return "status-in-review";
      case "rejected":
        return "status-rejected";
      default:
        return "bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const requirementStats = requirements ? {
    total: requirements.length,
    approved: requirements.filter(r => r.status === "Approved").length,
    inReview: requirements.filter(r => r.status === "In Review").length,
    rejected: requirements.filter(r => r.status === "Rejected").length,
  } : { total: 0, approved: 0, inReview: 0, rejected: 0 };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Requirements</h2>
        <p className="text-gray-600">Functional and non-functional requirements for the onboarding process</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Functional Requirements</h3>
                <Dialog open={newRequirementOpen} onOpenChange={setNewRequirementOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Requirement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Requirement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Code</label>
                          <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="REQ-001"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Owner</label>
                          <Input
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="Enter owner name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter requirement title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter detailed requirement description"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Functional">Functional</SelectItem>
                              <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Technical">Technical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button 
                        onClick={handleCreateRequirement} 
                        disabled={createRequirementMutation.isPending}
                        className="w-full"
                      >
                        {createRequirementMutation.isPending ? "Creating..." : "Create Requirement"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {requirements && requirements.length > 0 ? (
                  requirements.map((requirement) => (
                    <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">
                            {requirement.code}
                          </span>
                          <h4 className="font-medium text-gray-900">{requirement.title}</h4>
                        </div>
                        <span className={getStatusBadge(requirement.status)}>
                          {requirement.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">
                            Priority: <span className={`font-medium ${getPriorityColor(requirement.priority)}`}>
                              {requirement.priority}
                            </span>
                          </span>
                          <span className="text-gray-500">
                            Type: <span className="font-medium">{requirement.type}</span>
                          </span>
                        </div>
                        <span className="text-gray-500">
                          Owner: <span className="font-medium">{requirement.owner}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No requirements found. Create your first requirement to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Requirements</span>
                  <span className="text-sm font-medium">{requirementStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-green-600">{requirementStats.approved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Review</span>
                  <span className="text-sm font-medium text-yellow-600">{requirementStats.inReview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="text-sm font-medium text-red-600">{requirementStats.rejected}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Functional Requirements</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">Performance</h4>
                  <p className="text-xs text-gray-600">Process completion within 24 hours</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">Security</h4>
                  <p className="text-xs text-gray-600">GDPR compliance for personal data</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">Usability</h4>
                  <p className="text-xs text-gray-600">Self-service portal for managers</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-sm font-medium text-gray-900">Scalability</h4>
                  <p className="text-xs text-gray-600">Support 100+ concurrent users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <FolderOutput className="w-4 h-4 mr-3" />
                  Export to PDF
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  Export to Word
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-3" />
                  Share Requirements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
