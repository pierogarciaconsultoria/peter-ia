
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertTriangle, Lightbulb } from "lucide-react";

interface ProcessAnalysisProps {
  analysisData: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export function ProcessAnalysis({ analysisData }: ProcessAnalysisProps) {
  if (!analysisData) {
    return <div className="text-center p-6">Análise não disponível</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Análise do Processo</h2>
        <p className="text-muted-foreground mb-6">
          Esta análise foi gerada automaticamente com base nas informações do processo e melhores práticas de SIPOC e BPMN.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="bg-green-50 border-b pb-3">
            <CardTitle className="flex items-center text-green-700">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2">
              {analysisData.strengths.map((strength, index) => (
                <li key={index} className="text-sm">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-amber-50 border-b pb-3">
            <CardTitle className="flex items-center text-amber-700">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Oportunidades de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2">
              {analysisData.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm">{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 border-b pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2">
              {analysisData.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm">{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Análise de Metodologia SIPOC</h3>
        <div className="grid gap-4 md:grid-cols-5">
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Suppliers (Fornecedores)</h4>
            <p className="text-xs text-muted-foreground">
              Identificados corretamente com base nos requisitos de entrada.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Inputs (Entradas)</h4>
            <p className="text-xs text-muted-foreground">
              Bem definidos nos requisitos de entrada.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Process (Processo)</h4>
            <p className="text-xs text-muted-foreground">
              Atividades claras com responsáveis definidos.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Outputs (Saídas)</h4>
            <p className="text-xs text-muted-foreground">
              Resultado esperado bem especificado.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Customers (Clientes)</h4>
            <p className="text-xs text-muted-foreground">
              Identifique mais claramente quem são os beneficiários finais do processo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
