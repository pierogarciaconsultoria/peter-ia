
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FileText } from "lucide-react";

export default function Documents() {
  return (
    <PlaceholderPage 
      title="Documentos" 
      icon={<FileText className="mr-2 h-6 w-6 text-primary" />}
      description="Gestão e controle da documentação do SGQ." 
    />
  );
}
