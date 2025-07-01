
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useSecurityManager, SecurityReport, SecurityCheck } from '@/utils/securityManager';
import { toast } from 'sonner';

export function SecurityDashboard() {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { performAudit, isProductionEnvironment } = useSecurityManager();

  const runSecurityAudit = async () => {
    setIsLoading(true);
    try {
      const auditReport = await performAudit();
      setReport(auditReport);
      
      if (auditReport.overall === 'critical') {
        toast.error('Vulnerabilidades críticas encontradas!');
      } else if (auditReport.overall === 'warning') {
        toast.warning('Alguns problemas de segurança identificados');
      } else {
        toast.success('Sistema seguro - todos os checks passaram');
      }
    } catch (error) {
      toast.error('Erro ao executar auditoria de segurança');
      console.error('Security audit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSecurityAudit();
  }, []);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getOverallBadge = (status: SecurityReport['overall']) => {
    switch (status) {
      case 'secure':
        return <Badge className="bg-green-600">SEGURO</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">ATENÇÃO</Badge>;
      case 'critical':
        return <Badge className="bg-red-600">CRÍTICO</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Dashboard de Segurança</h2>
            <p className="text-muted-foreground">
              Monitoramento e auditoria de segurança do sistema
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isProductionEnvironment() && (
            <Badge variant="destructive" className="bg-red-600">
              PRODUÇÃO
            </Badge>
          )}
          <Button onClick={runSecurityAudit} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Executar Auditoria
          </Button>
        </div>
      </div>

      {report && (
        <>
          {/* Status Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Status Geral da Segurança
                {getOverallBadge(report.overall)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {report.checks.filter(c => c.status === 'pass').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Checks OK</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {report.checks.filter(c => c.status === 'warning').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Avisos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {report.checks.filter(c => c.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Erros</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verificações Detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle>Verificações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.checks.map((check, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">{check.message}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {check.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recomendações */}
          {report.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {report.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Ambiente de Produção - Alertas Especiais */}
          {isProductionEnvironment() && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Ambiente de Produção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription className="text-red-700">
                    ⚠️ Sistema em produção - todas as verificações de segurança devem passar.
                    Monitore regularmente este dashboard e configure alertas automáticos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
