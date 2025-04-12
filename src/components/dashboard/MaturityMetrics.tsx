
import { MaturityThermometer } from "@/components/MaturityThermometer";
import { StatisticCard } from "@/components/StatisticCard";
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card>
          <CardHeader>
            <CardTitle>Termômetro de Maturidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{maturityScore}%</div>
                <div className="text-sm text-muted-foreground">Maturidade do SGQ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}
