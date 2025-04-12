
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { MessageSquare } from "lucide-react";

export default function CustomerComplaints() {
  return (
    <PlaceholderPage 
      title="Reclamações de Clientes" 
      icon={<MessageSquare className="mr-2 h-6 w-6 text-primary" />}
      description="Gestão e tratamento de reclamações de clientes." 
    />
  );
}
