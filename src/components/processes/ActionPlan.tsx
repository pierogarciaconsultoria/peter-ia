
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed, DownloadCloud, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionItem {
  action: string;
  responsible: string;
  deadline: string;
  status: string;
}

interface ActionPlanProps {
  actionPlanData: ActionItem[];
}

export function ActionPlan({ actionPlanData }: ActionPlanProps) {
  if (!actionPlanData) {
    return <div className="text-center p-6">Dados do Plano de Ação não disponíveis</div>;
  }
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluído":
      case "concluido":
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case "em andamento":
      case "in progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case "pendente":
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      case "atrasado":
      case "delayed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Plano de Ação Sugerido</h2>
        <p className="text-muted-foreground mb-6">
          Com base na análise do processo, estas ações são recomendadas para melhorar a eficiência e eficácia
        </p>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ações Recomendadas</CardTitle>
              <CardDescription>
                Baseado na análise do processo e nas oportunidades de melhoria identificadas
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <DownloadCloud className="h-4 w-4 mr-1" /> PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Ação</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionPlanData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.action}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
        <div className="flex items-start space-x-4">
          <CircleDashed className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-blue-800 mb-2">Ciclo PDCA para Implementação</h3>
            <p className="text-sm text-blue-700 mb-4">
              Recomendamos seguir o ciclo PDCA para implementar as melhorias identificadas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-3 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Plan (Planejar)</h4>
                <p className="text-xs text-muted-foreground">
                  Definir objetivos claros para cada ação, responsáveis e prazos realistas.
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Do (Fazer)</h4>
                <p className="text-xs text-muted-foreground">
                  Implementar as mudanças em escala piloto antes da implantação completa.
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Check (Verificar)</h4>
                <p className="text-xs text-muted-foreground">
                  Avaliar os resultados usando os KPIs definidos para o processo.
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Act (Agir)</h4>
                <p className="text-xs text-muted-foreground">
                  Padronizar as melhorias bem-sucedidas e iniciar um novo ciclo para as que precisam de ajustes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
