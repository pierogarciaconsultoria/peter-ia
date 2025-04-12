
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users2 } from "lucide-react";

export default function Reunioes() {
  return (
    <PlaceholderPage 
      title="Reuniões" 
      icon={<Users2 className="mr-2 h-6 w-6 text-primary" />}
      description="Gestão de reuniões e atas da organização." 
    />
  );
}
