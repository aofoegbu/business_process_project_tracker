import { Plus, User, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ogelo ProcessFlow</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button className="text-primary font-medium border-b-2 border-primary pb-4 -mb-4">
                Dashboard
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Process Designer
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Projects
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Templates
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
