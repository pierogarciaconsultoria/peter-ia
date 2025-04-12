
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { CheckSquare } from "lucide-react";

export default function RawMaterialInspection() {
  return (
    <PlaceholderPage 
      title="Inspeção de Matéria Prima" 
      icon={<CheckSquare className="mr-2 h-6 w-6 text-primary" />}
      description="Controle e inspeção de matérias-primas." 
    />
  );
}
