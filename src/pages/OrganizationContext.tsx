
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Building2 } from "lucide-react";

export default function OrganizationContext() {
  return (
    <PlaceholderPage 
      title="Contexto da Organização" 
      icon={<Building2 className="mr-2 h-6 w-6 text-primary" />}
      description="Análise do contexto interno e externo da organização." 
    />
  );
}
