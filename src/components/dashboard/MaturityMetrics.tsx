
import { MaturityThermometer } from "@/components/MaturityThermometer";
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

  // Mock data for maturity calculation
  const modulesCompletion = [
    { module: "Documentação", completion: calculateTotalProgress(), weight: 0.2 },
    { module: "Não-Conformidades", completion: 65, weight: 0.15 },
    { module: "Indicadores", completion: 45, weight: 0.2 },
    { module: "Riscos", completion: 40, weight: 0.15 },
    { module: "Recursos Humanos", completion: 50, weight: 0.15 },
    { module: "Auditorias", completion: 60, weight: 0.15 },
  ];
  
  // Calculate overall score
  const completionScore = modulesCompletion.reduce(
    (sum, module) => sum + (module.completion * module.weight), 0
  );
  
  const goalsAchievement = 70; // Mock data for goals achievement
  
  // Final maturity score (70% from modules completion, 30% from goals)
  const maturityScore = Math.round((completionScore * 0.7) + (goalsAchievement * 0.3));

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <MaturityThermometer 
          score={maturityScore}
          modulesCompletion={modulesCompletion}
          goalsAchievement={goalsAchievement}
        />
      </div>
      <div className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatisticCard 
            title="Progress" 
            value={calculateTotalProgress()} 
            description="Overall Progress" 
            color="bg-primary" 
          />
          
          <StatisticCard 
            title="Not Started" 
            value={stats.notStarted} 
            description="Not Started" 
            color="bg-gray-400" 
            total={requirements.length} 
          />
          
          <StatisticCard 
            title="In Progress" 
            value={stats.inProgress} 
            description="In Progress" 
            color="bg-blue-500" 
            total={requirements.length} 
          />
          
          <StatisticCard 
            title="Completed" 
            value={stats.completed} 
            description="Completed" 
            color="bg-green-500" 
            total={requirements.length} 
          />
        </div>
      </div>
    </div>
  );
}
