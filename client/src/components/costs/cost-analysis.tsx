import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, DollarSign, CreditCard, PiggyBank, Percent, Users, Server, ClipboardCheck, GraduationCap, FileText, PieChart, TrendingUp } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type CostItem } from "@shared/schema";

interface CostAnalysisProps {
  projectId: number;
}

export default function CostAnalysis({ projectId }: CostAnalysisProps) {
  const { toast } = useToast();
  const [newCostItemOpen, setNewCostItemOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [budgeted, setBudgeted] = useState("");
  const [actual, setActual] = useState("");
  const [status, setStatus] = useState("Not Started");

  const { data: costItems, isLoading } = useQuery<CostItem[]>({
    queryKey: ["/api/projects", projectId, "cost-items"],
  });

  const createCostItemMutation = useMutation({
    mutationFn: async (data: {
      category: string;
      budgeted: number;
      actual: number;
      status: string;
    }) => {
      return apiRequest("POST", `/api/projects/${projectId}/cost-items`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "cost-items"] });
      setNewCostItemOpen(false);
      resetForm();
      toast({ title: "Cost item created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create cost item", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setCategory("");
    setBudgeted("");
    setActual("");
    setStatus("Not Started");
  };

  const handleCreateCostItem = () => {
    if (!category.trim() || !budgeted.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const budgetedAmount = parseInt(budgeted);
    const actualAmount = actual ? parseInt(actual) : 0;

    if (isNaN(budgetedAmount) || (actual && isNaN(actualAmount))) {
      toast({ title: "Please enter valid amounts", variant: "destructive" });
      return;
    }

    createCostItemMutation.mutate({
      category,
      budgeted: budgetedAmount,
      actual: actualAmount,
      status,
    });
  };

  const handleExportCostReport = (reportType: string) => {
    if (!costItems) return;
    
    const costStats = costItems.reduce((acc, item) => ({
      totalBudget: acc.totalBudget + item.budgeted,
      totalActual: acc.totalActual + item.actual,
      variance: acc.totalActual + item.actual - (acc.totalBudget + item.budgeted)
    }), { totalBudget: 0, totalActual: 0, variance: 0 });
    
    let reportData: any = {
      project: `Project ${projectId}`,
      reportType: reportType,
      exportDate: new Date().toISOString(),
      summary: costStats
    };
    
    if (reportType === 'budget') {
      reportData.budgetItems = costItems.map(item => ({
        category: item.category,
        budgeted: item.budgeted,
        actual: item.actual,
        variance: item.actual - item.budgeted,
        status: item.status
      }));
    } else if (reportType === 'breakdown') {
      reportData.breakdown = costItems.map(item => ({
        category: item.category,
        percentage: ((item.budgeted / costStats.totalBudget) * 100).toFixed(1),
        amount: item.budgeted
      }));
    } else if (reportType === 'roi') {
      reportData.roiAnalysis = {
        implementation_cost: costStats.totalBudget,
        annual_savings: 72000,
        payback_period: "7.5 months",
        three_year_roi: "380%"
      };
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cost_${reportType}_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Cost report exported",
      description: `${reportType} analysis downloaded successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "under budget":
        return "bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded";
      case "over budget":
        return "bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded";
      case "not started":
        return "bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded";
      default:
        return "bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "development team":
        return <Users className="w-4 h-4 text-blue-500 mr-3" />;
      case "infrastructure":
        return <Server className="w-4 h-4 text-orange-500 mr-3" />;
      case "testing & qa":
        return <ClipboardCheck className="w-4 h-4 text-purple-500 mr-3" />;
      case "training":
        return <GraduationCap className="w-4 h-4 text-green-500 mr-3" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500 mr-3" />;
    }
  };

  const costStats = costItems ? {
    totalBudget: costItems.reduce((sum, item) => sum + item.budgeted, 0),
    totalSpent: costItems.reduce((sum, item) => sum + item.actual, 0),
    totalRemaining: costItems.reduce((sum, item) => sum + (item.budgeted - item.actual), 0),
    utilizationRate: costItems.reduce((sum, item) => sum + item.budgeted, 0) > 0 ? 
      Math.round((costItems.reduce((sum, item) => sum + item.actual, 0) / costItems.reduce((sum, item) => sum + item.budgeted, 0)) * 100) : 0
  } : { totalBudget: 0, totalSpent: 0, totalRemaining: 0, utilizationRate: 0 };

  const defaultCostItems = [
    { category: "Development Team", budgeted: 25000, actual: 22500, status: "Under Budget" },
    { category: "Infrastructure", budgeted: 8000, actual: 7500, status: "Under Budget" },
    { category: "Testing & QA", budgeted: 6000, actual: 2500, status: "In Progress" },
    { category: "Training", budgeted: 6000, actual: 0, status: "Not Started" },
  ];

  const displayItems = costItems && costItems.length > 0 ? costItems : defaultCostItems;

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost Analysis</h2>
        <p className="text-gray-600">Project cost breakdown and budget tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">${costStats.totalBudget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Budget</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">${costStats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Spent</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">${costStats.totalRemaining.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Remaining</p>
              </div>
              <PiggyBank className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{costStats.utilizationRate}%</p>
                <p className="text-sm text-gray-600">Utilized</p>
              </div>
              <Percent className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
                <Dialog open={newCostItemOpen} onOpenChange={setNewCostItemOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Cost Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Cost Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Budgeted Amount</label>
                          <Input
                            value={budgeted}
                            onChange={(e) => setBudgeted(e.target.value)}
                            placeholder="0"
                            type="number"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Actual Amount</label>
                          <Input
                            value={actual}
                            onChange={(e) => setActual(e.target.value)}
                            placeholder="0"
                            type="number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Under Budget">Under Budget</SelectItem>
                            <SelectItem value="Over Budget">Over Budget</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleCreateCostItem} 
                        disabled={createCostItemMutation.isPending}
                        className="w-full"
                      >
                        {createCostItemMutation.isPending ? "Creating..." : "Create Cost Item"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Budgeted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actual</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Variance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item, index) => {
                      const variance = item.budgeted - item.actual;
                      const isActualItem = costItems && costItems.some(ci => ci.category === item.category);
                      
                      return (
                        <tr key={isActualItem ? `item-${item.category}` : `default-${index}`} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {getCategoryIcon(item.category)}
                              <span className="font-medium">{item.category}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">${item.budgeted.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-900">${item.actual.toLocaleString()}</td>
                          <td className={`py-3 px-4 ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.abs(variance).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={getStatusBadge(item.status)}>{item.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
              <div className="space-y-4">
                {displayItems.map((item, index) => {
                  const utilization = item.budgeted > 0 ? Math.round((item.actual / item.budgeted) * 100) : 0;
                  const isActualItem = costItems && costItems.some(ci => ci.category === item.category);
                  
                  return (
                    <div key={isActualItem ? `util-${item.category}` : `util-default-${index}`}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{item.category}</span>
                        <span className="font-medium">{utilization}%</span>
                      </div>
                      <Progress value={utilization} className="w-full" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Implementation Cost</span>
                  <span className="text-sm font-medium">${costStats.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annual Savings</span>
                  <span className="text-sm font-medium text-green-600">$72,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payback Period</span>
                  <span className="text-sm font-medium">7.5 months</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">3-Year ROI</span>
                  <span className="text-sm font-bold text-green-600">380%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Reports</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportCostReport('budget')}>
                  <FileText className="w-4 h-4 mr-3" />
                  Budget Report
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportCostReport('breakdown')}>
                  <PieChart className="w-4 h-4 mr-3" />
                  Cost Breakdown
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportCostReport('roi')}>
                  <TrendingUp className="w-4 h-4 mr-3" />
                  ROI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
