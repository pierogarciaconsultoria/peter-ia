
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { PackageCheck } from "lucide-react";

export default function NonConformingProducts() {
  return (
    <PlaceholderPage 
      title="Produtos Não Conformes" 
      icon={<PackageCheck className="mr-2 h-6 w-6 text-primary" />}
      description="Gestão de produtos não conformes." 
    />
  );
}
