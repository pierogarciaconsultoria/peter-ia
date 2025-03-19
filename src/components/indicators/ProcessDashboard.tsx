
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from "recharts";
import { IndicatorType, MeasurementType } from "@/types/indicators";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProcessDashboardProps {
  process: string;
  indicators: IndicatorType[];
  measurements: MeasurementType[];
}

export function ProcessDashboard({ process, indicators, measurements }: ProcessDashboardProps) {
  // Filtra indicadores do processo atual
  const processIndicators = useMemo(() => {
    return indicators.filter(indicator => indicator.process === process);
  }, [indicators, process]);

  // Obtém últimos 12 meses para análise
  const last12Months = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    const result = [];
    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      result.push({ month, year });
    }
    return result.reverse();
  }, []);

  // Preparar dados para o gráfico de barras - valores atuais vs metas
  const currentValuesData = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    return processIndicators.map(indicator => {
      const measurement = measurements.find(
        m => m.indicator_id === indicator.id && 
             m.month === currentMonth && 
             m.year === currentYear
      );
      
      const value = measurement ? measurement.value : 0;
      
      return {
        name: indicator.name,
        Valor: value,
        Meta: indicator.goal_value,
        goalType: indicator.goal_type,
        unit: indicator.unit || ""
      };
    });
  }, [processIndicators, measurements]);

  // Preparar dados para o gráfico de tendência (linha)
  const trendData = useMemo(() => {
    if (processIndicators.length === 0) return [];
    
    // Transformar dados para formato de tendência por mês
    return last12Months.map(({ month, year }) => {
      const monthData: any = {
        month: `${getMonthName(month)}/${year.toString().substring(2)}`,
      };
      
      processIndicators.forEach(indicator => {
        const measurement = measurements.find(
          m => m.indicator_id === indicator.id && 
               m.month === month && 
               m.year === year
        );
        
        monthData[indicator.name] = measurement ? measurement.value : null;
      });
      
      return monthData;
    });
  }, [processIndicators, measurements, last12Months]);

  // Sem indicadores para este processo
  if (processIndicators.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Processo: {process}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">
            Nenhum indicador cadastrado para este processo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular o status geral do processo
  const processHealth = calculateProcessHealth(processIndicators, measurements);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Processo: {process}</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            processHealth >= 75 ? "bg-green-100 text-green-800" : 
            processHealth >= 50 ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {processHealth >= 75 ? "Excelente" : 
             processHealth >= 50 ? "Regular" : 
             "Insatisfatório"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Gráfico de barras - Valores atuais vs Metas */}
          <div>
            <h3 className="font-medium mb-4">Indicadores vs Metas</h3>
            <div className="h-[300px]">
              <ChartContainer 
                config={{
                  Valor: { label: "Valor Atual" },
                  Meta: { label: "Valor Meta" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentValuesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                    />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="font-bold">{data.name}</div>
                              <div>Valor Atual: {data.Valor} {data.unit}</div>
                              <div>Meta: {data.Meta} {data.unit}</div>
                              <div>Tipo: {formatGoalType(data.goalType)}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Valor" fill="#3b82f6" />
                    <Bar dataKey="Meta" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          {/* Gráfico de linha - Tendência dos últimos 12 meses */}
          <div>
            <h3 className="font-medium mb-4">Tendência (12 meses)</h3>
            <div className="h-[300px]">
              <ChartContainer 
                config={
                  processIndicators.reduce((acc, indicator) => {
                    acc[indicator.name] = { label: indicator.name };
                    return acc;
                  }, {} as any)
                }
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <div className="font-bold">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value !== null ? entry.value : 'Sem dados'}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    {processIndicators.map((indicator, index) => (
                      <Line
                        key={indicator.id}
                        type="monotone"
                        dataKey={indicator.name}
                        stroke={getLineColor(index)}
                        connectNulls={true}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funções auxiliares
function getMonthName(month: number): string {
  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return monthNames[month - 1];
}

function getLineColor(index: number): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];
  return colors[index % colors.length];
}

function formatGoalType(goalType: string): string {
  switch (goalType) {
    case 'higher_better': return 'Quanto maior, melhor';
    case 'lower_better': return 'Quanto menor, melhor';
    case 'target': return 'Meta específica';
    default: return goalType;
  }
}

function calculateProcessHealth(indicators: IndicatorType[], measurements: MeasurementType[]): number {
  if (indicators.length === 0) return 0;
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  let achievingGoals = 0;
  
  indicators.forEach(indicator => {
    const measurement = measurements.find(
      m => m.indicator_id === indicator.id && 
           m.month === currentMonth && 
           m.year === currentYear
    );
    
    if (!measurement) return;
    
    const value = measurement.value;
    
    if (indicator.goal_type === 'higher_better' && value >= indicator.goal_value) {
      achievingGoals++;
    } else if (indicator.goal_type === 'lower_better' && value <= indicator.goal_value) {
      achievingGoals++;
    } else if (indicator.goal_type === 'target' && value === indicator.goal_value) {
      achievingGoals++;
    }
  });
  
  return Math.round((achievingGoals / indicators.length) * 100);
}
