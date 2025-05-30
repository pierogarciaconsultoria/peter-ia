
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { EmployeeTrainingCompliance, ComplianceStats } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";

interface ComplianceDashboardProps {
  companyId: string;
  onRefresh: () => void;
}

export function ComplianceDashboard({ companyId, onRefresh }: ComplianceDashboardProps) {
  const [compliance, setCompliance] = useState<EmployeeTrainingCompliance[]>([]);
  const [stats, setStats] = useState<ComplianceStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadComplianceData();
  }, [companyId]);

  const loadComplianceData = async () => {
    try {
      setIsLoading(true);
      const [complianceData, statsData] = await Promise.all([
        TrainingMatrixService.getEmployeeCompliance(companyId),
        TrainingMatrixService.getComplianceStats(companyId)
      ]);

      setCompliance(complianceData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading compliance data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de compliance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplianceStatus = async (id: string, status: string) => {
    try {
      await TrainingMatrixService.updateEmployeeCompliance(id, { 
        status: status as any,
        completion_date: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined
      });
      
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso.",
      });
      
      loadComplianceData();
      onRefresh();
    } catch (error) {
      console.error("Error updating compliance:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, label: "Concluído" },
      in_progress: { variant: "secondary" as const, label: "Em Andamento" },
      pending: { variant: "outline" as const, label: "Pendente" },
      overdue: { variant: "destructive" as const, label: "Atrasado" },
      exempt: { variant: "secondary" as const, label: "Isento" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</p>
              </div>
              <Progress value={stats.completionRate} className="w-16" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance List */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Compliance dos Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compliance.slice(0, 10).map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.employee?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.requirement?.training?.title || item.requirement?.procedure?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vencimento: {item.due_date ? new Date(item.due_date).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    {item.status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateComplianceStatus(item.id, 'completed')}
                      >
                        Marcar como Concluído
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {compliance.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum registro de compliance</h3>
                <p className="text-muted-foreground">
                  Os registros de compliance serão criados automaticamente quando funcionários forem atribuídos a cargos com requisitos de treinamento.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
