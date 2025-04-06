
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Clock } from "lucide-react";
import { getDeadlineStatistics } from "@/utils/isoDeadlines";

export function ImplementationSchedule() {
  const deadlineStats = getDeadlineStatistics();

  return (
    <div className="mt-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Cronograma de Implementação</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Requisitos Atrasados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-600">{deadlineStats.overdue}</div>
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Ação urgente
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-600">Próximos 30 dias</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600">{deadlineStats.upcoming}</div>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Em andamento
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Concluídos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">{deadlineStats.completed}</div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Completo
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Total de Requisitos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlineStats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Progresso total: {calculateTotalProgress()}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to calculate progress
function calculateTotalProgress() {
  const deadlineStats = getDeadlineStatistics();
  if (deadlineStats.total === 0) return 0;
  return Math.round((deadlineStats.completed / deadlineStats.total) * 100);
}
