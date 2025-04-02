
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle, TrendingUp } from "lucide-react";

interface VSMDataProps {
  cycleTime: string;
  valueAddedTime: string;
  nonValueAddedTime: string;
  bottlenecks: string[];
}

interface ValueStreamMapProps {
  vsmData: VSMDataProps;
  processData: any;
}

export function ValueStreamMap({ vsmData, processData }: ValueStreamMapProps) {
  if (!vsmData) {
    return <div className="text-center p-6">Dados do Mapa de Valor não disponíveis</div>;
  }

  // Convert percentage strings to numbers for the progress bars
  const valueAddedPercentage = parseInt(vsmData.valueAddedTime);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Mapa de Fluxo de Valor (VSM)</h2>
        <p className="text-muted-foreground mb-6">
          Análise do fluxo de valor do processo, identificando atividades que agregam valor e gargalos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tempo de Ciclo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{vsmData.cycleTime}</div>
            <p className="text-sm text-muted-foreground">
              Tempo total estimado para completar o processo do início ao fim
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Eficiência do Processo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo que Agrega Valor</span>
                <span className="font-medium">{vsmData.valueAddedTime}</span>
              </div>
              <Progress value={valueAddedPercentage} className="h-2" />
              
              <div className="flex justify-between text-sm mt-4">
                <span>Tempo que Não Agrega Valor</span>
                <span className="font-medium">{vsmData.nonValueAddedTime}</span>
              </div>
              <Progress value={100 - valueAddedPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Gargalos Identificados</AlertTitle>
        <AlertDescription>
          <ul className="list-disc ml-5 mt-2">
            {vsmData.bottlenecks.map((bottleneck, index) => (
              <li key={index}>{bottleneck}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
      
      <div className="border rounded-md p-6 bg-slate-50">
        <h3 className="font-medium mb-4">Mapa de Fluxo de Valor</h3>
        
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
          {processData.activities && processData.activities.map((activity, index) => (
            <div key={index} className="flex flex-col min-w-[200px]">
              <div className={`border rounded-md p-3 ${vsmData.bottlenecks.includes(activity.activity) ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                <div className="font-medium text-sm mb-1">{activity.activity}</div>
                <div className="text-xs text-muted-foreground mb-2">Responsável: {activity.actor}</div>
                
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span>Tempo de Processamento:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 60) + 15} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo de Espera:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 240) + 60} min</span>
                  </div>
                </div>
              </div>
              
              {index < processData.activities.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <div className="h-0 w-6 border-t-2 border-dashed transform rotate-90"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
        <h3 className="font-medium mb-2">Oportunidades de Melhoria com Lean</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Reduzir tempo de espera entre atividades</li>
          <li>Eliminar atividades que não agregam valor</li>
          <li>Padronizar o processo para reduzir variabilidade</li>
          <li>Implementar sistema puxado para melhorar o fluxo</li>
        </ul>
      </div>
    </div>
  );
}
