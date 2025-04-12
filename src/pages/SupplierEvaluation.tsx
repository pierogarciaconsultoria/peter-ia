
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Network } from "lucide-react";

export default function SupplierEvaluation() {
  return (
    <PlaceholderPage 
      title="Avaliação de Fornecedores" 
      icon={<Network className="mr-2 h-6 w-6 text-primary" />}
      description="Avaliação e qualificação de fornecedores." 
    />
  );
}
