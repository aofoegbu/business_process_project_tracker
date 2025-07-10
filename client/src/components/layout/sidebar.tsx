import { Folder, FolderOpen, FileText, Plus, Upload, Download, Users, Server, ClipboardCheck } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Recent Projects
          </h2>
          <div className="space-y-2">
            <div className="flex items-center p-2 rounded-lg bg-blue-50 text-primary">
              <FolderOpen className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Employee Onboarding</span>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Folder className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Invoice Processing</span>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Folder className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">System Access Request</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Process Templates
          </h2>
          <div className="space-y-2">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Approval Workflow</span>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Review Process</span>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Escalation Flow</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Plus className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Create Process</span>
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Upload className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Import Diagram</span>
            </button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="w-4 h-4 mr-3 text-gray-400" />
              <span className="text-sm">Export Reports</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
