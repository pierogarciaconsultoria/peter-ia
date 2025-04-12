
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Cog } from "lucide-react";

export default function EquipmentCalibration() {
  return (
    <PlaceholderPage 
      title="Calibração de Equipamentos" 
      icon={<Cog className="mr-2 h-6 w-6 text-primary" />}
      description="Controle e calibração de equipamentos de medição." 
    />
  );
}
