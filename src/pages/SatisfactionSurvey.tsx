
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { MessageSquare } from "lucide-react";

export default function SatisfactionSurvey() {
  return (
    <PlaceholderPage 
      title="Pesquisa de Satisfação" 
      icon={<MessageSquare className="mr-2 h-6 w-6 text-primary" />}
      description="Monitoramento da satisfação dos clientes." 
    />
  );
}
