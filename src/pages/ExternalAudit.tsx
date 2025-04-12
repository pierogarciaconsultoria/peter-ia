
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Shield } from "lucide-react";

export default function ExternalAudit() {
  return (
    <PlaceholderPage 
      title="Auditoria Externa" 
      icon={<Shield className="mr-2 h-6 w-6 text-primary" />}
      description="Planejamento e acompanhamento de auditorias externas." 
    />
  );
}
