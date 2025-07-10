import { useState } from "react";
import { useParams } from "wouter";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ProjectOverview from "@/components/overview/project-overview";
import ProcessDesigner from "@/components/process/process-designer";
import RequirementsManager from "@/components/requirements/requirements-manager";
import UATManager from "@/components/testing/uat-manager";
import CostAnalysis from "@/components/costs/cost-analysis";

type TabType = "overview" | "process" | "requirements" | "testing" | "costs";

export default function Dashboard() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const currentProjectId = projectId ? parseInt(projectId) : 1;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "process", label: "Process Designer" },
    { id: "requirements", label: "Requirements" },
    { id: "testing", label: "UAT & Testing" },
    { id: "costs", label: "Cost Analysis" },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectOverview projectId={currentProjectId} />;
      case "process":
        return <ProcessDesigner projectId={currentProjectId} />;
      case "requirements":
        return <RequirementsManager projectId={currentProjectId} />;
      case "testing":
        return <UATManager projectId={currentProjectId} />;
      case "costs":
        return <CostAnalysis projectId={currentProjectId} />;
      default:
        return <ProjectOverview projectId={currentProjectId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
