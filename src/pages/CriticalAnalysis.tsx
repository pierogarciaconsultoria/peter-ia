
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function CriticalAnalysis() {
  return (
    <PlaceholderPage 
      title="Análise Crítica" 
      icon={<BarChart3 className="mr-2 h-6 w-6 text-primary" />}
      description="Análise crítica pela direção do sistema de gestão da qualidade." 
    />
  );
}
