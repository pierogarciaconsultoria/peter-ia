
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, AlertTriangle } from 'lucide-react';

export const ISODashboardWidget: React.FC = () => {
  // Mock data - in a real app this would come from your ISO management system
  const isoProgress = 78;
  const totalRequirements = 23;
  const completedRequirements = 18;
  const pendingRequirements = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ISO 9001:2015 Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Geral</span>
            <span>{isoProgress}%</span>
          </div>
          <Progress value={isoProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedRequirements}</div>
            <div className="text-xs text-green-700">Concluídos</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{pendingRequirements}</div>
            <div className="text-xs text-amber-700">Pendentes</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">Em conformidade</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-600">2 ações pendentes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
