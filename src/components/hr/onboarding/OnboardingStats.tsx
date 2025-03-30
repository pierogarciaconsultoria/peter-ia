
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, User } from "lucide-react";
import { OnboardingProcess } from "./types";

interface OnboardingStatsProps {
  onboardingProcesses: OnboardingProcess[];
}

export function OnboardingStats({ onboardingProcesses }: OnboardingStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Onboardings Ativos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onboardingProcesses.filter(p => p.status === "em_andamento").length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Novos Funcionários (Mês)
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Onboardings Concluídos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onboardingProcesses.filter(p => p.status === "concluido").length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
