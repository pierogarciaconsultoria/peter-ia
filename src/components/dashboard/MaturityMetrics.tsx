
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

  // Calculate overall maturity score based on requirements progress
  const maturityScore = calculateTotalProgress();

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Maturidade do SGQ</CardTitle>
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
