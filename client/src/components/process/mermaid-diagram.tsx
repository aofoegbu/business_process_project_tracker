import { useEffect, useRef } from "react";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export default function MermaidDiagram({ code, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current) return;

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default;
        
        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          flowchart: {
            htmlLabels: true,
            curve: "basis",
          },
          themeVariables: {
            primaryColor: "#3B82F6",
            primaryTextColor: "#1F2937",
            primaryBorderColor: "#1E40AF",
            lineColor: "#6B7280",
            sectionBkgColor: "#F3F4F6",
            altSectionBkgColor: "#E5E7EB",
            gridColor: "#E5E7EB",
            tertiaryColor: "#F9FAFB",
          },
        });

        // Clear previous content
        elementRef.current.innerHTML = "";

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, code);
        
        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="p-4 border border-red-200 rounded-lg bg-red-50">
              <p class="text-sm text-red-700">Error rendering diagram</p>
              <p class="text-xs text-red-600 mt-1">${error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [code]);

  return <div ref={elementRef} className={className} />;
}
