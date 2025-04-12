
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ClipboardList } from "lucide-react";

export default function ActionSchedule() {
  return (
    <PlaceholderPage 
      title="Plano de Ação" 
      icon={<ClipboardList className="mr-2 h-6 w-6 text-primary" />}
      description="Acompanhamento e gestão dos planos de ação." 
    />
  );
}
