
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function PerformanceIndicators() {
  return (
    <PlaceholderPage 
      title="Indicadores de Desempenho" 
      icon={<BarChart3 className="mr-2 h-6 w-6 text-primary" />}
      description="Monitoramento e análise dos indicadores de desempenho da organização." 
    />
  );
}
