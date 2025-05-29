
import { DepartmentOrgChart } from "@/components/hr/DepartmentOrgChart";
import { useOrgStructure } from "./OrgStructureProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrgStructureChart() {
  const { positions, loading, error, refetch } = useOrgStructure();
  
  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando organograma...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg">Erro ao carregar organograma</h3>
              <p className="text-muted-foreground mt-1">{error}</p>
            </div>
            <Button onClick={refetch} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (positions.length === 0) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Nenhum cargo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Configure cargos e departamentos para visualizar o organograma.
            </p>
            <Button onClick={refetch} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Convert JobPositionWithHierarchy[] to match the format expected by DepartmentOrgChart
  const formattedPositions = positions.map(pos => ({
    id: pos.id,
    title: pos.title,
    department: pos.department,
    level: pos.level,
    parentPosition: pos.parentPosition,
    isDepartmentHead: pos.isDepartmentHead || false
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Organograma da Empresa</span>
          <div className="text-sm text-muted-foreground">
            {positions.length} cargo{positions.length !== 1 ? 's' : ''} encontrado{positions.length !== 1 ? 's' : ''}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <DepartmentOrgChart positions={formattedPositions} />
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
