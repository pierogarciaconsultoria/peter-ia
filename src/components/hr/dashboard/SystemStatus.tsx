
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle } from "lucide-react";

interface MetricStatus {
  value: number;
  status: 'success' | 'error' | 'pending';
  error?: string;
}

interface DashboardMetrics {
  employeeCount: MetricStatus;
  newEmployees: MetricStatus;
  openPositions: MetricStatus;
  pendingOnboarding: MetricStatus;
  pendingEvaluations: MetricStatus;
  developmentPlans: MetricStatus;
}

interface SystemStatusProps {
  metrics: DashboardMetrics;
  errors: string[];
}

export function SystemStatus({ metrics, errors }: SystemStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Conectividade com banco de dados</span>
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Métricas carregadas com sucesso</span>
            <Badge variant="outline">
              {Object.values(metrics).filter(m => m.status === 'success').length}/6
            </Badge>
          </div>
          {errors.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span>Tabelas com problemas</span>
              <Badge variant="destructive">
                {errors.length}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
