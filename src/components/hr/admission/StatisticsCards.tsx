
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, SquareCheck, UserCheck } from "lucide-react";
import { AdmissionProcess } from "./types";

interface StatisticsCardsProps {
  admissionProcesses: AdmissionProcess[];
}

export function StatisticsCards({ admissionProcesses }: StatisticsCardsProps) {
  const pendingCount = admissionProcesses.filter(p => p.status !== "contrato_assinado").length;
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Admissões Pendentes
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <SquareCheck className="h-4 w-4 mr-2" />
              Documentações Completas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{admissionProcesses.filter(p => p.completion >= 80).length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Contratados no Mês
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{admissionProcesses.filter(p => p.status === "contrato_assinado").length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
