
import { StatisticCard } from "@/components/StatisticCard";
import { ISORequirement } from "@/utils/isoRequirements";

interface MaturityMetricsProps {
  requirements: ISORequirement[];
}

export function MaturityMetrics({ requirements }: MaturityMetricsProps) {
  const calculateTotalProgress = () => {
    const totalRequirements = requirements.length;
    if (totalRequirements === 0) return 0;
    const totalProgress = requirements.reduce((sum, req) => sum + req.progress, 0);
    return Math.round(totalProgress / totalRequirements);
  };

  const countByStatus = () => {
    return {
      notStarted: requirements.filter(r => r.status === 'not-started').length,
      inProgress: requirements.filter(r => r.status === 'in-progress').length,
      review: requirements.filter(r => r.status === 'review').length,
      completed: requirements.filter(r => r.status === 'completed').length
    };
  };

  const stats = countByStatus();

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatisticCard 
        title="Progresso" 
        value={calculateTotalProgress()} 
        description="Progresso Geral" 
        color="bg-primary" 
      />
      
      <StatisticCard 
        title="Não Iniciados" 
        value={stats.notStarted} 
        description="Não Iniciados" 
        color="bg-gray-400" 
        total={requirements.length} 
      />
      
      <StatisticCard 
        title="Em Progresso" 
        value={stats.inProgress} 
        description="Em Andamento" 
        color="bg-blue-500" 
        total={requirements.length} 
      />
      
      <StatisticCard 
        title="Concluídos" 
        value={stats.completed} 
        description="Concluídos" 
        color="bg-green-500" 
        total={requirements.length} 
      />
    </div>
  );
}
