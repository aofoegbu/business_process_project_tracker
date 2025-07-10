import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, ClipboardList, CheckCircle, XCircle, Clock, BarChart3, Bug, FileText, Server } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type TestCase } from "@shared/schema";

interface UATManagerProps {
  projectId: number;
}

export default function UATManager({ projectId }: UATManagerProps) {
  const { toast } = useToast();
  const [newTestCaseOpen, setNewTestCaseOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tester, setTester] = useState("");

  const { data: testCases, isLoading } = useQuery<TestCase[]>({
    queryKey: ["/api/projects", projectId, "test-cases"],
  });

  const createTestCaseMutation = useMutation({
    mutationFn: async (data: {
      code: string;
      title: string;
      description: string;
      steps: string;
      expected: string;
      priority: string;
      tester: string;
    }) => {
      return apiRequest("POST", `/api/projects/${projectId}/test-cases`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "test-cases"] });
      setNewTestCaseOpen(false);
      resetForm();
      toast({ title: "Test case created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create test case", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setCode("");
    setTitle("");
    setDescription("");
    setSteps("");
    setExpected("");
    setPriority("Medium");
    setTester("");
  };

  const handleCreateTestCase = () => {
    if (!code.trim() || !title.trim() || !description.trim() || !steps.trim() || !expected.trim() || !tester.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createTestCaseMutation.mutate({
      code,
      title,
      description,
      steps,
      expected,
      priority,
      tester,
    });
  };

  const handleExportTestReport = (reportType: string) => {
    if (!testCases) return;
    
    const testStats = {
      total: testCases.length,
      passed: testCases.filter(tc => tc.status === "Passed").length,
      failed: testCases.filter(tc => tc.status === "Failed").length,
      pending: testCases.filter(tc => tc.status === "Pending").length,
      blocked: testCases.filter(tc => tc.status === "Blocked").length
    };
    
    let reportData: any = {
      project: `Project ${projectId}`,
      reportType: reportType,
      exportDate: new Date().toISOString(),
      summary: testStats
    };
    
    if (reportType === 'summary') {
      reportData.testCases = testCases.map(tc => ({
        code: tc.code,
        title: tc.title,
        priority: tc.priority,
        status: tc.status,
        tester: tc.tester
      }));
    } else if (reportType === 'defects') {
      reportData.defects = testCases
        .filter(tc => tc.status === "Failed" && tc.issue)
        .map(tc => ({
          testCase: tc.code,
          title: tc.title,
          issue: tc.issue,
          tester: tc.tester
        }));
    } else if (reportType === 'signoff') {
      reportData.signoff = {
        overallStatus: testStats.failed === 0 && testStats.blocked === 0 ? "APPROVED" : "PENDING",
        completionRate: Math.round((testStats.passed / testStats.total) * 100),
        approver: "UAT Team Lead",
        signoffDate: new Date().toISOString()
      };
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UAT_${reportType}_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Test report exported",
      description: `${reportType} report downloaded successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "status-passed";
      case "failed":
        return "status-failed";
      case "pending":
        return "status-pending";
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

  const testStats = testCases ? {
    total: testCases.length,
    passed: testCases.filter(t => t.status === "Passed").length,
    failed: testCases.filter(t => t.status === "Failed").length,
    pending: testCases.filter(t => t.status === "Pending").length,
  } : { total: 0, passed: 0, failed: 0, pending: 0 };

  const overallProgress = testStats.total > 0 ? 
    Math.round(((testStats.passed + testStats.failed) / testStats.total) * 100) : 0;
  const criticalProgress = testStats.total > 0 ? 
    Math.round((testStats.passed / testStats.total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Acceptance Testing</h2>
        <p className="text-gray-600">Test cases and UAT tracking for the onboarding process</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{testStats.total}</p>
                <p className="text-sm text-gray-600">Total Test Cases</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{testStats.passed}</p>
                <p className="text-sm text-gray-600">Passed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{testStats.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{testStats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Test Cases</h3>
                <Dialog open={newTestCaseOpen} onOpenChange={setNewTestCaseOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add New Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Code</label>
                          <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="TC-001"
                          />
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
                        <div>
                          <label className="text-sm font-medium">Tester</label>
                          <Input
                            value={tester}
                            onChange={(e) => setTester(e.target.value)}
                            placeholder="Enter tester name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter test case title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter test case description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Test Steps</label>
                        <Textarea
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          placeholder="Enter test steps (one per line)"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Expected Result</label>
                        <Textarea
                          value={expected}
                          onChange={(e) => setExpected(e.target.value)}
                          placeholder="Enter expected result"
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateTestCase} 
                        disabled={createTestCaseMutation.isPending}
                        className="w-full"
                      >
                        {createTestCaseMutation.isPending ? "Creating..." : "Create Test Case"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {testCases && testCases.length > 0 ? (
                  testCases.map((testCase) => (
                    <div key={testCase.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">
                            {testCase.code}
                          </span>
                          <h4 className="font-medium text-gray-900">{testCase.title}</h4>
                        </div>
                        <span className={getStatusBadge(testCase.status)}>
                          {testCase.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
                      <div className="text-sm space-y-2">
                        <div><span className="font-medium">Steps:</span> {testCase.steps}</div>
                        <div><span className="font-medium">Expected:</span> {testCase.expected}</div>
                        {testCase.issue && (
                          <div className="text-red-600">
                            <span className="font-medium">Issue:</span> {testCase.issue}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-200">
                        <span className="text-gray-500">
                          Priority: <span className={`font-medium ${getPriorityColor(testCase.priority)}`}>
                            {testCase.priority}
                          </span>
                        </span>
                        <span className="text-gray-500">
                          Tester: <span className="font-medium">{testCase.tester}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No test cases found. Create your first test case to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UAT Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Critical Tests</span>
                    <span className="font-medium">{criticalProgress}%</span>
                  </div>
                  <Progress value={criticalProgress} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Environments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm font-medium">UAT Environment</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium">Staging Environment</span>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">Maintenance</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 text-blue-600 mr-3" />
                    <span className="text-sm font-medium">Dev Environment</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Reports</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportTestReport('summary')}>
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Test Summary Report
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportTestReport('defects')}>
                  <Bug className="w-4 h-4 mr-3" />
                  Defect Report
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportTestReport('signoff')}>
                  <FileText className="w-4 h-4 mr-3" />
                  UAT Sign-off
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
