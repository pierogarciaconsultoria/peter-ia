
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { GitBranch } from "lucide-react";

export default function ProcessPage() {
  return (
    <PlaceholderPage 
      title="Processos" 
      icon={<GitBranch className="mr-2 h-6 w-6 text-primary" />}
      description="Mapeamento e gestão dos processos da organização." 
    />
  );
}
