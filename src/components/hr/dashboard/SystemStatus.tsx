
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, XCircle, Clock } from "lucide-react";
import React from "react";

interface MetricStatus {
  value: number;
  status: "success" | "error" | "pending";
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

export function SystemStatus({
  metrics,
  errors,
}: SystemStatusProps) {
  const metricLabels: Record<keyof DashboardMetrics, string> = {
    employeeCount: "Colaboradores",
    newEmployees: "Novas Contratações",
    openPositions: "Vagas Abertas",
    pendingOnboarding: "Onboarding Pendentes",
    pendingEvaluations: "Avaliações Pendentes",
    developmentPlans: "PDIs Ativos",
  };

  const getStatusBadge = (status: MetricStatus["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="success" className="bg-green-100 text-green-700">OK</Badge>;
      case "error":
        return <Badge variant="destructive" className="bg-red-100 text-red-700">Erro</Badge>;
      case "pending":
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Aguardando</Badge>;
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="flex items-center space-x-2">
              {metric.status === "success" && <CheckCircle className="text-green-500 w-4 h-4" />}
              {metric.status === "error" && <XCircle className="text-red-500 w-4 h-4" />}
              {metric.status === "pending" && <Clock className="text-yellow-500 w-4 h-4" />}
              <span className="font-medium">
                {metricLabels[key as keyof DashboardMetrics] || key}
              </span>
              <span className="ml-1 text-muted-foreground">
                {typeof metric.value === "number" ? metric.value : "-"}
              </span>
              {getStatusBadge(metric.status)}
            </div>
          ))}
        </div>
        {errors.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-red-600 mb-2 text-sm">Erros encontrados:</h4>
            <ul className="list-disc pl-5 text-sm text-destructive">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
