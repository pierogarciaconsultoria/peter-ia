
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ISODashboardWidgetProps {
  className?: string;
}

export const ISODashboardWidget: React.FC<ISODashboardWidgetProps> = ({
  className = ''
}) => {
  // Dados simulados - em produção viriam de uma API
  const isoData = {
    overallProgress: 72,
    implementedRequirements: 53,
    totalRequirements: 74,
    criticalPending: 3,
    nextDeadline: "30/12/2024",
    recentlyCompleted: [
      { number: "4.1", title: "Contexto da Organização" },
      { number: "7.2", title: "Competência" },
      { number: "8.5", title: "Produção e Provisão de Serviço" }
    ],
    pendingCritical: [
      { number: "9.2", title: "Auditoria Interna" },
      { number: "9.3", title: "Análise Crítica" },
      { number: "10.2", title: "Não Conformidade" }
    ]
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>ISO 9001:2015</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {isoData.overallProgress}% Implementada
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Geral</span>
            <span className="font-medium">{isoData.implementedRequirements}/{isoData.totalRequirements} requisitos</span>
          </div>
          <Progress value={isoData.overallProgress} className="h-2" />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">Implementados</p>
                <p className="text-lg font-bold text-green-700">{isoData.implementedRequirements}</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-red-600 font-medium">Críticos Pendentes</p>
                <p className="text-lg font-bold text-red-700">{isoData.criticalPending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recentemente Implementados
          </h4>
          <div className="space-y-1">
            {isoData.recentlyCompleted.slice(0, 2).map((req) => (
              <div key={req.number} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                <span>ISO {req.number} - {req.title}</span>
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Critical Pending */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Requisitos Críticos Pendentes
          </h4>
          <div className="space-y-1">
            {isoData.pendingCritical.slice(0, 2).map((req) => (
              <div key={req.number} className="flex items-center justify-between text-xs p-2 bg-red-50 rounded border border-red-200">
                <span>ISO {req.number} - {req.title}</span>
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Pendente
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to="/iso-9001" className="flex-1">
            <Button variant="default" size="sm" className="w-full text-xs">
              Ver Detalhes
            </Button>
          </Link>
          <Link to="/action-schedule" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Plano de Ação
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
