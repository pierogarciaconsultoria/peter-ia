
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { performHealthCheck, logHealthCheck, HealthCheckResult } from "@/services/healthCheckService";
import { useToast } from "@/components/ui/use-toast";

export function HealthMonitor() {
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await performHealthCheck();
      setHealthResult(result);
      await logHealthCheck(result);
      
      if (result.status === 'error') {
        toast({
          title: "Sistema com problemas",
          description: "Alguns serviços estão com falhas. Verifique os detalhes.",
          variant: "destructive"
        });
      } else if (result.status === 'warning') {
        toast({
          title: "Sistema funcionando com avisos",
          description: "Alguns componentes precisam de atenção.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no health check",
        description: "Não foi possível verificar o status do sistema.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'error') => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;
    
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Status do Sistema</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={runHealthCheck}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthResult ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-medium">Status Geral:</span>
              {getStatusBadge(healthResult.status)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthResult.checks.database.status)}
                <span>Banco de Dados</span>
                {healthResult.checks.database.latency && (
                  <span className="text-sm text-muted-foreground">
                    ({healthResult.checks.database.latency}ms)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusIcon(healthResult.checks.authentication.status)}
                <span>Autenticação</span>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusIcon(healthResult.checks.environment.status)}
                <span>Configuração</span>
                <span className="text-sm text-muted-foreground">
                  ({healthResult.checks.environment.environment})
                </span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Última verificação: {new Date(healthResult.timestamp).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Verificando sistema...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
