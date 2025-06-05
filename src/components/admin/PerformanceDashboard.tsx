
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityMonitor } from '@/components/security/SecurityMonitor';
import { authOptimization } from '@/utils/authOptimization';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const PerformanceDashboard: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [cacheStats, setCacheStats] = useState({ size: 0, hitRate: 0 });
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    // Iniciar limpeza automática de cache
    authOptimization.startCacheCleanup();

    // Atualizar estatísticas periodicamente
    const interval = setInterval(() => {
      const stats = authOptimization.getCacheStats();
      setCacheStats({
        size: stats.size,
        hitRate: stats.hitRate
      });
      
      // Determinar saúde do sistema baseado nas métricas
      if (stats.size > 1000) {
        setSystemHealth('warning');
      } else if (stats.size > 2000) {
        setSystemHealth('critical');
      } else {
        setSystemHealth('healthy');
      }
    }, 30000); // A cada 30 segundos

    return () => {
      clearInterval(interval);
      authOptimization.stopCacheCleanup();
    };
  }, []);

  const handleClearCache = () => {
    authOptimization.clearCache();
    setCacheStats({ size: 0, hitRate: 0 });
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Acesso restrito a super administradores
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHealthIcon = () => {
    switch (systemHealth) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Performance</h2>
        <div className="flex items-center gap-2">
          {getHealthIcon()}
          <span className="text-sm font-medium capitalize">
            Sistema {systemHealth === 'healthy' ? 'Saudável' : 
                    systemHealth === 'warning' ? 'Atenção' : 'Crítico'}
          </span>
        </div>
      </div>

      {/* Estatísticas de Cache */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Cache Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.size}</div>
            <p className="text-xs text-muted-foreground">Entradas em cache</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.hitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Taxa de acerto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleClearCache}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Limpar Cache
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monitor de Segurança */}
      <SecurityMonitor />

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Otimizações Implementadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Políticas RLS unificadas e otimizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sistema de cache inteligente implementado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Índices de performance criados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Auditoria de acesso configurada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Função SECURITY DEFINER para verificação de permissões</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
