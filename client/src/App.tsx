import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ProcessDesigner from "@/pages/process-designer";
import ProjectList from "@/pages/project-list";
import Templates from "@/pages/templates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/project/:projectId" component={Dashboard} />
      <Route path="/process-designer" component={ProcessDesigner} />
      <Route path="/projects" component={ProjectList} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/:templateType" component={Templates} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
