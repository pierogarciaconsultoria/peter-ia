
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { AlertTriangle } from "lucide-react";

export default function NonCompliance() {
  return (
    <PlaceholderPage 
      title="Não Conformidades" 
      icon={<AlertTriangle className="mr-2 h-6 w-6 text-primary" />}
      description="Registro e tratamento de não conformidades." 
    />
  );
}
