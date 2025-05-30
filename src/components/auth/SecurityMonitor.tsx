
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthPerformance } from '@/hooks/useAuthPerformance';
import { useSecurityContext } from '@/hooks/useSecurityContext';
import { Shield, Gauge, Zap, RefreshCw } from 'lucide-react';

export const SecurityMonitor: React.FC = () => {
  const { metrics, resetMetrics, optimizeCache } = useAuthPerformance();
  const securityContext = useSecurityContext();

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'destructive';
    if (value <= thresholds[1]) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitor de Segurança e Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas de Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gauge className="h-4 w-4" />
                <span className="text-sm font-medium">Queries</span>
              </div>
              <div className="text-2xl font-bold">{metrics.queriesCount}</div>
              <Badge variant="outline" className="mt-1">
                Total executadas
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Tempo Médio</span>
              </div>
              <div className="text-2xl font-bold">
                {metrics.avgQueryTime.toFixed(1)}ms
              </div>
              <Badge 
                variant={getPerformanceColor(metrics.avgQueryTime, [100, 200])}
                className="mt-1"
              >
                Performance
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm font-medium">Cache Hit Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {metrics.cacheHitRate.toFixed(1)}%
              </div>
              <Badge 
                variant={getPerformanceColor(metrics.cacheHitRate, [70, 85])}
                className="mt-1"
              >
                Eficiência
              </Badge>
            </div>
          </div>

          {/* Informações de Segurança */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Status de Segurança</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="outline" className="ml-2">
                  {securityContext.getUserRole()}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Admin:</span>
                <Badge 
                  variant={securityContext.isAdmin() ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {securityContext.isAdmin() ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={optimizeCache} 
              variant="outline" 
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Otimizar Cache
            </Button>
            <Button 
              onClick={resetMetrics} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Métricas
            </Button>
          </div>

          {/* Informações da última otimização */}
          <div className="text-xs text-muted-foreground">
            Última otimização: {metrics.lastOptimization.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
