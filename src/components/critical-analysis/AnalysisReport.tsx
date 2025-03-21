
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CriticalAnalysisItem, Attachment } from "@/types/critical-analysis";

interface AnalysisReportProps {
  analysis: CriticalAnalysisItem;
}

export const AnalysisReport = forwardRef<HTMLDivElement, AnalysisReportProps>(
  ({ analysis }, ref) => {
    const getStatusText = (status: string) => {
      switch (status) {
        case "planned":
          return "Planejada";
        case "in-progress":
          return "Em Andamento";
        case "completed":
          return "Concluída";
        default:
          return status;
      }
    };
    
    const getFileIcon = (fileType: string) => {
      if (fileType.includes("pdf")) {
        return <FileText className="text-red-500" size={16} />;
      } else if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx")) {
        return <FileText className="text-green-500" size={16} />;
      } else if (fileType.includes("document") || fileType.includes("word") || fileType.includes("docx")) {
        return <FileText className="text-blue-500" size={16} />;
      } else if (fileType.includes("presentation") || fileType.includes("powerpoint") || fileType.includes("pptx")) {
        return <FileText className="text-orange-500" size={16} />;
      } else {
        return <FileText className="text-gray-500" size={16} />;
      }
    };
    
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) {
        return bytes + ' bytes';
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
      } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      }
    };
    
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" id="analysis-report">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Relatório de Análise Crítica</h1>
          <p className="text-muted-foreground">
            {format(analysis.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold">{analysis.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{getStatusText(analysis.status)}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-sm">Participantes:</h3>
            <p>{analysis.participants.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Documentos de Referência:</h3>
            <p>{analysis.documents.join(", ")}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Requisitos para Entrada da Análise Crítica</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Situação de Ações Anteriores:</h3>
              <p className="mt-1">{analysis.previousActionsStatus}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Mudanças Externas e Internas:</h3>
              <p className="mt-1">{analysis.externalInternalChanges}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Informações de Desempenho:</h3>
              <p className="mt-1">{analysis.performanceInfo}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Suficiência de Recursos:</h3>
              <p className="mt-1">{analysis.resourceSufficiency}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Eficácia de Ações para Riscos:</h3>
              <p className="mt-1">{analysis.riskActionsEffectiveness}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Oportunidades de Melhoria Identificadas:</h3>
              <p className="mt-1">{analysis.improvementOpportunities}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Resultados da Análise Crítica</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Oportunidades para Melhoria:</h3>
              <p className="mt-1">{analysis.improvementResults}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Necessidades de Mudança no SGQ:</h3>
              <p className="mt-1">{analysis.systemChangeNeeds}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Necessidade de Recursos:</h3>
              <p className="mt-1">{analysis.resourceNeeds}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Resultados Gerais:</h3>
              <p className="mt-1">{analysis.results}</p>
            </div>
          </div>
        </div>
        
        {analysis.attachments.length > 0 && (
          <>
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-lg font-bold mb-4">Anexos</h2>
              <div className="space-y-2">
                {analysis.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded">
                    {getFileIcon(attachment.type)}
                    <span>{attachment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(attachment.size)})
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      {attachment.category === "input" ? "Requisito" : "Resultado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>
    );
  }
);

AnalysisReport.displayName = "AnalysisReport";
