
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onNewDocument?: () => void; // Making this optional since we're removing the button
}

export function DashboardHeader({
  onNewDocument
}: DashboardHeaderProps) {
  return <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <span className="text-sm font-medium text-muted-foreground"></span>
        <h1 className="text-3xl font-bold mt-1">Sistema de Gestão da Qualidade</h1>
      </div>
      {/* New Document button removed */}
    </div>;
}
