import React from 'react';
import { StatisticCard } from './ui/StatisticCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { generateRandomData } from '@/utils/mock';
import { Button } from '@/components/ui/button';
import { CalendarRange } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ISORequirementBadge } from './iso/badges/ISORequirementBadge';
import { ISODashboardWidget } from './iso/dashboard/ISODashboardWidget';
import { ISOQuickAccess } from './iso/navigation/ISOQuickAccess';

export const Dashboard: React.FC = () => {
  const { totalUsers, activeUsers, totalRevenue, taskCompletionRate } = useDashboardData();

  // Mock data for demonstration
  const companyInfo = {
    name: "ACME Corp",
    mission: "To lead the industry with innovative solutions and exceptional service.",
    values: ["Innovation", "Quality", "Customer Focus", "Integrity"]
  };

  const overallProgress = 75;
  const criticalTasks = generateRandomData(3);
  const upcomingDeadlines = generateRandomData(4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DateRangePicker>
            <Button variant="outline">
              <CalendarRange className="mr-2 h-4 w-4" />
              <span>Últimos 30 dias</span>
            </Button>
          </DateRangePicker>
        </div>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticCard title="Total de Usuários" value={totalUsers} description="Usuários registrados" />
        <StatisticCard title="Usuários Ativos" value={activeUsers} description="Usuários ativos na última semana" />
        <StatisticCard title="Receita Total" value={`R$${totalRevenue}`} description="Receita gerada no último mês" />
        <StatisticCard title="Taxa de Conclusão de Tarefas" value={`${taskCompletionRate}%`} description="Média de tarefas concluídas" />
      </div>

      {/* Nova seção com ISO Dashboard Widget e Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ISODashboardWidget />
        </div>
        <div className="lg:col-span-2">
          <ISOQuickAccess />
        </div>
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Informações da Empresa</h2>
          <p><strong>Nome:</strong> {companyInfo.name}</p>
          <p><strong>Missão:</strong> {companyInfo.mission}</p>
          <div>
            <strong>Valores:</strong>
            <ul className="list-disc pl-5">
              {companyInfo.values.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Progresso Geral */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Progresso Geral do Projeto</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Progresso Total</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>
        </CardContent>
      </Card>

      {/* Tarefas Críticas */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Tarefas Críticas</h2>
          <ul className="list-disc pl-5">
            {criticalTasks.map((task, index) => (
              <li key={index}>{task.title} - {task.status}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Próximos Prazos */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Próximos Prazos</h2>
          <ul className="list-disc pl-5">
            {upcomingDeadlines.map((deadline, index) => (
              <li key={index}>{deadline.title} - {deadline.dueDate}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
