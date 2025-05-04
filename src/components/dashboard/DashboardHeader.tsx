
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewDocument: () => void;
}

export function DashboardHeader({ onNewDocument }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <span className="text-sm font-medium text-muted-foreground">ISO 9001:2015</span>
        <h1 className="text-3xl font-bold mt-1">Sistema de Gestão da Qualidade</h1>
      </div>
      <Button className="self-start" onClick={onNewDocument}>
        <Plus size={16} className="mr-2" />
        Novo Documento
      </Button>
    </div>
  );
}
