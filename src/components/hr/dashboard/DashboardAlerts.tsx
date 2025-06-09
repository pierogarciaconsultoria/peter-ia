
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, UserCheck } from "lucide-react";

interface MetricStatus {
  value: number;
  status: 'success' | 'error' | 'pending';
  error?: string;
}

interface DashboardAlertsProps {
  pendingEvaluations: MetricStatus;
  pendingOnboarding: MetricStatus;
}

export function DashboardAlerts({ pendingEvaluations, pendingOnboarding }: DashboardAlertsProps) {
  return (
    <>
      {pendingEvaluations.status === 'success' && pendingEvaluations.value > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ações pendentes</AlertTitle>
          <AlertDescription>
            Existem {pendingEvaluations.value} avaliações de período de experiência aguardando sua análise.
          </AlertDescription>
        </Alert>
      )}
      
      {pendingOnboarding.status === 'success' && pendingOnboarding.value > 0 && (
        <Alert>
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Processos de onboarding</AlertTitle>
          <AlertDescription>
            Existem {pendingOnboarding.value} processos de onboarding em andamento.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
