
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ListChecks } from "lucide-react";

export default function AuditSchedule() {
  return (
    <PlaceholderPage 
      title="Agenda de Auditoria" 
      icon={<ListChecks className="mr-2 h-6 w-6 text-primary" />}
      description="Planejamento e agendamento de auditorias internas." 
    />
  );
}
