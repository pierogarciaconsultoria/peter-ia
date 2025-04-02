
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BpmnDiagramProps {
  processData: any;
}

export function BpmnDiagram({ processData }: BpmnDiagramProps) {
  // In a real implementation, we would generate a proper BPMN diagram
  // This is a simplified placeholder visualization
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Diagrama BPMN</h2>
        <p className="text-muted-foreground mb-6">
          Representação visual do processo {processData.name} usando notação BPMN 2.0
        </p>
      </div>
      
      <div className="border border-dashed rounded-md p-6 bg-slate-50">
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl h-[500px]">
            {/* Placeholder for BPMN diagram - in a real app this would be rendered using a BPMN library */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <svg className="w-16 h-16 text-muted-foreground mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Diagrama BPMN de {processData.name}</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Este diagrama mostra o fluxo do processo desde seus requisitos de entrada até o resultado esperado, 
                passando por todas as atividades definidas no mapeamento.
              </p>
              <div className="w-full max-w-2xl bg-white border rounded-md p-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 font-bold">
                    Início
                  </div>
                  <div className="h-0 w-12 border-t-2 border-dashed"></div>
                  
                  {processData.activities && processData.activities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <div className="h-16 min-w-28 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-center p-2 text-center text-sm">
                        {activity.activity}
                      </div>
                      <div className="h-0 w-12 border-t-2 border-dashed"></div>
                    </React.Fragment>
                  ))}
                  
                  <div className="h-16 w-16 bg-green-100 rounded-md flex items-center justify-center text-green-600 font-bold">
                    Fim
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
          <CardDescription>Elementos utilizados no diagrama BPMN</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 text-xs font-bold">
                I
              </div>
              <span className="text-sm">Evento de início</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-12 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-center text-xs">
                Act
              </div>
              <span className="text-sm">Atividade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center text-green-600 text-xs font-bold">
                F
              </div>
              <span className="text-sm">Evento de fim</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
