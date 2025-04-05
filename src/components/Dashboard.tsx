
import { StatisticCard } from "@/components/StatisticCard";
import { ISORequirement } from "@/utils/isoRequirements";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, AlertTriangle, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { DocumentForm } from "@/components/DocumentForm";
import { MaturityThermometer } from "@/components/MaturityThermometer";
import { getDeadlineStatistics } from "@/utils/isoDeadlines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  requirements: ISORequirement[];
}

export function Dashboard({
  requirements
}: DashboardProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const calculateTotalProgress = () => {
    const totalRequirements = requirements.length;
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
  const deadlineStats = getDeadlineStatistics();

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

  const handleNewDocument = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <header className="mb-8 appear-animate" style={{ "--delay": 0 } as React.CSSProperties}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">ISO 9001:2015</span>
          <h1 className="text-3xl font-bold mt-1">Sistema de Gestão da Qualidade</h1>
        </div>
        <Button className="self-start" onClick={handleNewDocument}>
          <Plus size={16} className="mr-2" />
          New Document
        </Button>
      </div>
      
      {/* Cronograma de Implementação - Nova seção */}
      <div className="mt-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cronograma de Implementação</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">Requisitos Atrasados</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{deadlineStats.overdue}</div>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                Ação urgente
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-600">Próximos 30 dias</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{deadlineStats.upcoming}</div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Em andamento
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Concluídos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{deadlineStats.completed}</div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Completo
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Total de Requisitos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deadlineStats.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Progresso total: {calculateTotalProgress()}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Maturity Thermometer - positioned before the statistics cards */}
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
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentForm document={null} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
