
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Settings } from "lucide-react";

export default function AdminPage() {
  return (
    <PlaceholderPage 
      title="Administração" 
      icon={<Settings className="mr-2 h-6 w-6 text-primary" />}
      description="Configurações e administração do sistema." 
    />
  );
}
