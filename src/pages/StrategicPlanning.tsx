
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { TrendingUp } from "lucide-react";

export default function StrategicPlanning() {
  return (
    <PlaceholderPage 
      title="Planejamento Estratégico" 
      icon={<TrendingUp className="mr-2 h-6 w-6 text-primary" />}
      description="Defina e acompanhe os objetivos estratégicos da organização." 
    />
  );
}
