
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useHRDashboard } from "./HRDashboardProvider";
import { Action5W2H } from "@/types/actions";
import { ActionsByResponsible } from "@/components/actions/responsible/ActionsByResponsible";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ActionPlanTab() {
  const navigate = useNavigate();
  const { dashboardData, isLoading } = useHRDashboard();
  const [mockActions] = useState<Action5W2H[]>([
    {
      id: "1",
      title: "Revisar processo de recrutamento",
      what: "Revisão completa do processo de recrutamento",
      why: "Melhorar a eficiência do processo e qualidade das contratações",
      where: "Departamento de RH",
      when: new Date().toISOString(),
      who: "Equipe de RH",
      how: "Analisar processos atuais e implementar melhorias",
      responsible: "Maria Silva",
      how_much: 0,
      currency: "BRL",
      due_date: "2025-06-30",
      start_date: "2025-05-01",
      status: "planned",
      priority: "high",
      process_area: "RH",
      source: "internal_audit"
    },
    {
      id: "2",
      title: "Implementar programa de onboarding",
      what: "Criação de programa estruturado para novos funcionários",
      why: "Melhorar a experiência de integração e reduzir tempo de adaptação",
      where: "Todos departamentos",
      when: new Date().toISOString(),
      who: "Equipe de RH e Líderes",
      how: "Desenvolver material e fluxo de onboarding",
      responsible: "João Santos",
      how_much: 5000,
      currency: "BRL",
      due_date: "2025-07-15",
      start_date: "2025-05-15",
      status: "in_progress",
      priority: "medium",
      process_area: "RH",
      source: "strategic_planning"
    },
    {
      id: "3",
      title: "Capacitação em gestão de pessoas",
      what: "Treinamento para líderes em gestão de equipes",
      why: "Desenvolver habilidades de liderança",
      where: "Sala de treinamento",
      when: new Date().toISOString(),
      who: "Líderes de departamento",
      how: "Contratar consultoria especializada",
      responsible: "Ana Oliveira",
      how_much: 10000,
      currency: "BRL",
      due_date: "2025-08-20",
      start_date: "2025-07-01",
      status: "planned",
      priority: "medium",
      process_area: "Treinamento",
      source: "improvement_opportunity"
    },
    {
      id: "4",
      title: "Revisão da política salarial",
      what: "Análise da estrutura salarial atual",
      why: "Manter competitividade no mercado",
      where: "Departamento Financeiro e RH",
      when: new Date().toISOString(),
      who: "Comitê de compensação",
      how: "Benchmarking com mercado e revisão interna",
      responsible: "Carlos Mendes",
      how_much: 0,
      currency: "BRL",
      due_date: "2025-09-30",
      start_date: "2025-08-01",
      status: "planned",
      priority: "high",
      process_area: "Financeiro",
      source: "strategic_planning"
    }
  ]);

  const handleView = (action: Action5W2H) => {
    navigate("/action-schedule", { 
      state: { actionId: action.id, actionView: true } 
    });
  };

  const handleEdit = (action: Action5W2H) => {
    navigate("/action-schedule", { 
      state: { actionId: action.id, actionEdit: true } 
    });
  };

  const handleDelete = (action: Action5W2H) => {
    // Esta função seria implementada com o sistema real
    console.log("Deletar ação:", action.id);
  };

  const navigateToActionSchedule = () => {
    navigate("/action-schedule");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Plano de Ação</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as ações por responsável
          </p>
        </div>
        <Button onClick={navigateToActionSchedule}>
          Ver Todos os Planos de Ação
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <ActionsByResponsible
          actions={mockActions}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
