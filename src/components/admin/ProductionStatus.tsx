
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { 
  getProductionConfig, 
  validateProductionReadiness, 
  initializeProductionFeatures,
  ProductionConfig 
} from "@/services/productionConfigService";
import { useToast } from "@/components/ui/use-toast";

export function ProductionStatus() {
  const [config, setConfig] = useState<ProductionConfig | null>(null);
  const [validation, setValidation] = useState<{
    ready: boolean;
    issues: string[];
    recommendations: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadProductionStatus = async () => {
    setIsLoading(true);
    try {
      const [configData, validationData] = await Promise.all([
        getProductionConfig(),
        validateProductionReadiness()
      ]);
      
      setConfig(configData);
      setValidation(validationData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar status de produção",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeProduction = async () => {
    try {
      await initializeProductionFeatures();
      toast({
        title: "Sucesso",
        description: "Recursos de produção inicializados com sucesso",
        variant: "default"
      });
      loadProductionStatus();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao inicializar recursos de produção",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadProductionStatus();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getEnvironmentBadge = (env: string) => {
    return env === 'production' ? (
      <Badge variant="default" className="bg-green-600">PRODUÇÃO</Badge>
    ) : (
      <Badge variant="secondary">DESENVOLVIMENTO</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status de Produção</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadProductionStatus}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {config && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">Ambiente:</span>
                {getEnvironmentBadge(config.environment)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.security_enabled)}
                  <span className="text-sm">Segurança Habilitada</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.audit_logging)}
                  <span className="text-sm">Log de Auditoria</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.health_monitoring)}
                  <span className="text-sm">Monitoramento</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(config.rls_policies_active)}
                  <span className="text-sm">Políticas RLS</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {validation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validation.ready ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              Prontidão para Produção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validation.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Problemas Encontrados:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validation.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">Recomendações:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validation.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-600">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleInitializeProduction}
                disabled={!validation.ready}
                className="flex-1"
              >
                Inicializar Produção
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
