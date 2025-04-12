
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <PlaceholderPage 
      title="Ajuda" 
      icon={<HelpCircle className="mr-2 h-6 w-6 text-primary" />}
      description="Informações e ajuda sobre o sistema." 
    />
  );
}
