
import { RequirementDeadline } from "./isoTypes";

// Função para verificar se um prazo está em atraso
export const isOverdue = (deadline: RequirementDeadline): boolean => {
  const today = new Date();
  const targetDate = new Date(deadline.targetDate);
  return today > targetDate && deadline.status !== 'completed';
};

// Dados simulados de prazos para requisitos da ISO 9001
export const requirementDeadlines: RequirementDeadline[] = [
  {
    requirementId: "4.1",
    targetDate: "2025-05-15",
    responsiblePerson: "Maria Silva",
    priority: "high",
    status: "in-progress"
  },
  {
    requirementId: "4.2",
    targetDate: "2025-05-20",
    responsiblePerson: "João Costa",
    priority: "medium",
    status: "not-started"
  },
  {
    requirementId: "4.3",
    targetDate: "2025-04-30",
    responsiblePerson: "Ana Pereira",
    priority: "high",
    status: "in-progress"
  },
  {
    requirementId: "4.4",
    targetDate: "2025-06-15",
    responsiblePerson: "Carlos Santos",
    priority: "critical",
    status: "not-started"
  },
  {
    requirementId: "5.1",
    targetDate: "2025-05-10",
    responsiblePerson: "Patrícia Lima",
    priority: "high",
    status: "review"
  },
  {
    requirementId: "5.2",
    targetDate: "2025-03-30",
    responsiblePerson: "Roberto Alves",
    priority: "critical",
    status: "overdue"
  },
  {
    requirementId: "6.1",
    targetDate: "2025-07-15",
    responsiblePerson: "Fernanda Costa",
    priority: "medium",
    status: "not-started"
  },
  {
    requirementId: "7.1",
    targetDate: "2025-06-30",
    responsiblePerson: "Paulo Mendes",
    priority: "medium",
    status: "in-progress"
  },
  {
    requirementId: "8.1",
    targetDate: "2025-08-15",
    responsiblePerson: "Cristina Gomes",
    priority: "medium",
    status: "not-started"
  },
  {
    requirementId: "9.1",
    targetDate: "2025-09-10",
    responsiblePerson: "Lucas Ferreira",
    priority: "high",
    status: "not-started"
  },
  {
    requirementId: "10.1",
    targetDate: "2025-10-15",
    responsiblePerson: "Amanda Ribeiro",
    priority: "medium",
    status: "not-started"
  }
];

// Função para obter o prazo de um requisito específico
export const getRequirementDeadline = (requirementId: string): RequirementDeadline | undefined => {
  return requirementDeadlines.find(deadline => deadline.requirementId === requirementId);
};

// Função para obter estatísticas de prazos
export const getDeadlineStatistics = () => {
  const today = new Date();
  
  const overdueCount = requirementDeadlines.filter(
    deadline => new Date(deadline.targetDate) < today && deadline.status !== 'completed'
  ).length;
  
  const upcomingCount = requirementDeadlines.filter(
    deadline => {
      const targetDate = new Date(deadline.targetDate);
      const diffTime = Math.abs(targetDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return targetDate >= today && diffDays <= 30 && deadline.status !== 'completed';
    }
  ).length;
  
  const completedCount = requirementDeadlines.filter(
    deadline => deadline.status === 'completed'
  ).length;
  
  return {
    total: requirementDeadlines.length,
    overdue: overdueCount,
    upcoming: upcomingCount,
    completed: completedCount
  };
};
