
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { IndicatorType, MeasurementType } from "@/types/indicators";

interface ProcessDashboardProps {
  process: string;
  indicators: any[];
  measurements: any[];
  processIndicators?: any[];  // Indicadores vindos diretamente dos processos
}

export function ProcessDashboard({ 
  process, 
  indicators, 
  measurements,
  processIndicators = []
}: ProcessDashboardProps) {
  // Filtrar indicadores desse processo
  const processSpecificIndicators = indicators.filter(ind => ind.process === process);
  
  // Criar dados para os indicadores de processo
  const processIndicatorData = processIndicators.map(ind => ({
    name: ind.name,
    meta: ind.goal,
    valor: ind.current,
    meses: ["Atual"] // Simplificado para exibição atual
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Processo: {process}</span>
          <span className="text-sm text-muted-foreground">
            {processSpecificIndicators.length + processIndicators.length} indicadores
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Indicadores da tabela performance_indicators */}
        {processSpecificIndicators.map(indicator => {
          const indicatorMeasurements = measurements
            .filter(m => m.indicator_id === indicator.id)
            .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
            .slice(-6); // Últimos 6 meses
            
          const chartData = indicatorMeasurements.map(m => ({
            mês: `${m.month}/${m.year}`,
            valor: m.value,
            meta: indicator.goal_value
          }));
          
          return (
            <div key={indicator.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{indicator.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    Meta: <span className="font-semibold">{indicator.goal_value}{indicator.unit}</span>
                  </span>
                  {indicatorMeasurements.length > 0 && (
                    <span className="text-sm">
                      Atual: <span className="font-semibold">
                        {indicatorMeasurements[indicatorMeasurements.length - 1].value}{indicator.unit}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mês" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                      <Line type="monotone" dataKey="meta" stroke="#82ca9d" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center text-muted-foreground">
                  Sem medições para exibir
                </div>
              )}
            </div>
          );
        })}
        
        {/* Indicadores simples vindos diretamente dos processos */}
        {processIndicators.map((indicator, index) => (
          <div key={`process-ind-${index}`} className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{indicator.name}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Meta: <span className="font-semibold">{indicator.goal}</span>
                </span>
                <span className="text-sm">
                  Atual: <span className="font-semibold">{indicator.current}</span>
                </span>
              </div>
            </div>
            
            <div className="h-16 flex items-center justify-center text-muted-foreground mt-2">
              Indicador importado do processo
            </div>
          </div>
        ))}
        
        {processSpecificIndicators.length === 0 && processIndicators.length === 0 && (
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            Nenhum indicador cadastrado para este processo
          </div>
        )}
      </CardContent>
    </Card>
  );
}
