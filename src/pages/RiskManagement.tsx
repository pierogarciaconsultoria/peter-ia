
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { AlertTriangle } from "lucide-react";

export default function RiskManagement() {
  return (
    <PlaceholderPage 
      title="Gestão de Riscos" 
      icon={<AlertTriangle className="mr-2 h-6 w-6 text-primary" />}
      description="Identificação e tratamento de riscos e oportunidades." 
    />
  );
}
