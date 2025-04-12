
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ClipboardCheck } from "lucide-react";

export default function QualityControl() {
  return (
    <PlaceholderPage 
      title="Controle de Qualidade" 
      icon={<ClipboardCheck className="mr-2 h-6 w-6 text-primary" />}
      description="Monitoramento e controle da qualidade dos produtos e serviços." 
    />
  );
}
