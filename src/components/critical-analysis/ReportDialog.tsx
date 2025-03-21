
import React, { useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, Sparkles } from "lucide-react";
import { AnalysisReport } from "./AnalysisReport";
import { CriticalAnalysisItem } from "@/types/critical-analysis";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Textarea } from "@/components/ui/textarea";

interface ReportDialogProps {
  analysis: CriticalAnalysisItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisUpdate?: (updatedAnalysis: CriticalAnalysisItem) => void;
}

export function ReportDialog({ analysis, open, onOpenChange, onAnalysisUpdate }: ReportDialogProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [prompt, setPrompt] = useState<string>("");

  const handlePrint = () => {
    if (!reportRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Não foi possível abrir uma nova janela para impressão");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Análise Crítica - ${analysis?.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .badge { 
              display: inline-block;
              border-radius: 9999px;
              padding: 2px 8px;
              font-size: 12px;
              font-weight: 500;
              background-color: #f3f4f6;
            }
            .separator {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 24px 0;
            }
          </style>
        </head>
        <body>
          ${reportRef.current.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Aguardar a renderização da página antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !analysis) return;
    
    try {
      toast.info("Gerando PDF, aguarde...");
      
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      let position = 0;
      
      // Se o conteúdo for maior que uma página A4
      while (position < imgHeight) {
        // Adicionar nova página se não for a primeira
        if (position > 0) {
          pdf.addPage();
        }
        
        // Adicionar parte da imagem à página atual
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          -position, 
          imgWidth, 
          imgHeight
        );
        
        position += 265; // Altura aproximada da página A4 com margens
      }
      
      // Nome do arquivo com data
      const fileName = `analise-critica-${analysis.subject.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(fileName);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    }
  };
  
  const generateAIContent = async () => {
    if (!analysis) return;
    
    try {
      setIsGeneratingContent(true);
      
      // Construir o prompt para o ChatGPT
      const systemPrompt = `Você é um especialista em Sistemas de Gestão da Qualidade e ISO 9001.
        Baseado nas informações fornecidas sobre uma reunião de análise crítica pela direção,
        elabore um relatório profissional e detalhado que sistematize as informações de forma clara e objetiva.
        Utilize linguagem formal e técnica apropriada para documentação de SGQ.
        Estruture o texto de forma coesa, conectando os requisitos de entrada com os resultados.
        Seu relatório deve ter caráter analítico, não apenas descritivo.`;
      
      const userPrompt = prompt || `Elabore um relatório detalhado para a análise crítica com o tema "${analysis.subject}" com as seguintes informações:
        
        Requisitos de entrada:
        - Situação de ações anteriores: ${analysis.previousActionsStatus}
        - Mudanças em questões externas e internas: ${analysis.externalInternalChanges}
        - Informações de desempenho: ${analysis.performanceInfo}
        - Suficiência de recursos: ${analysis.resourceSufficiency}
        - Eficácia de ações para riscos: ${analysis.riskActionsEffectiveness}
        - Oportunidades de melhoria identificadas: ${analysis.improvementOpportunities}
        
        Resultados:
        - Oportunidades para melhoria: ${analysis.improvementResults}
        - Necessidades de mudança no SGQ: ${analysis.systemChangeNeeds}
        - Necessidade de recursos: ${analysis.resourceNeeds}
        - Resultados gerais: ${analysis.results}`;
      
      // Simular chamada para API do ChatGPT (em um cenário real, seria uma chamada para uma função edge do Supabase)
      const response = await simulateAIRequest(systemPrompt, userPrompt);
      
      if (response && onAnalysisUpdate) {
        const updatedAnalysis = {
          ...analysis,
          aiGeneratedContent: response
        };
        onAnalysisUpdate(updatedAnalysis);
        toast.success("Conteúdo gerado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar conteúdo com IA:", error);
      toast.error("Ocorreu um erro ao gerar o conteúdo. Tente novamente.");
    } finally {
      setIsGeneratingContent(false);
    }
  };
  
  // Função para simular uma chamada à API do ChatGPT
  // Em uma implementação real, isso seria substituído por uma chamada à API OpenAI através de uma função edge do Supabase
  const simulateAIRequest = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    // Simulação de tempo de resposta
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Texto simulado de retorno
    return `# Relatório de Análise Crítica: ${analysis?.subject}

## Introdução
Este relatório apresenta os resultados da análise crítica pela direção realizada em ${analysis?.date.toLocaleDateString()}, com foco em avaliar a eficácia e adequação do Sistema de Gestão da Qualidade (SGQ) e identificar oportunidades de melhoria.

## Análise dos Requisitos de Entrada

### Situação de Ações Anteriores
${analysis?.previousActionsStatus}

A análise da situação das ações anteriores demonstra um compromisso com a melhoria contínua, embora existam pontos pendentes que demandam atenção para garantir a eficácia do SGQ.

### Mudanças em Questões Externas e Internas
${analysis?.externalInternalChanges}

As mudanças identificadas representam tanto desafios quanto oportunidades para a organização, exigindo adaptação e resposta estratégica para manter a relevância e eficácia do SGQ.

### Informações de Desempenho
${analysis?.performanceInfo}

Os indicadores de desempenho demonstram uma tendência positiva, evidenciando a eficácia das ações implementadas, embora existam áreas específicas que requerem intervenção para atingir as metas estabelecidas.

### Suficiência de Recursos
${analysis?.resourceSufficiency}

A análise de recursos revela pontos críticos que devem ser endereçados para garantir a sustentabilidade das operações e a capacidade de atender aos requisitos aplicáveis.

### Eficácia de Ações para Riscos
${analysis?.riskActionsEffectiveness}

As estratégias de mitigação de riscos demonstram eficácia variável, com sucessos significativos em algumas áreas, enquanto outras requerem revisão e fortalecimento das abordagens adotadas.

### Oportunidades de Melhoria Identificadas
${analysis?.improvementOpportunities}

Foram identificadas oportunidades estratégicas que, se adequadamente implementadas, têm potencial para elevar significativamente o desempenho do SGQ e agregar valor aos processos organizacionais.

## Resultados da Análise Crítica

### Conclusões e Recomendações
Com base na análise integrada dos requisitos de entrada, conclui-se que o SGQ mantém-se eficaz, porém com necessidades específicas de ajustes para otimizar seu desempenho e garantir sua contínua adequação.

### Plano de Ação
1. Implementar as melhorias identificadas: ${analysis?.improvementResults}
2. Realizar as mudanças necessárias no SGQ: ${analysis?.systemChangeNeeds}
3. Provisionar os recursos necessários: ${analysis?.resourceNeeds}

### Considerações Finais
${analysis?.results}

Este relatório demonstra o compromisso da organização com a melhoria contínua e a eficácia do SGQ, fornecendo direcionamento claro para as próximas etapas e decisões estratégicas.`;
  };

  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório de Análise Crítica</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 border rounded-md bg-muted/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Assistente de IA para Geração de Conteúdo</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateAIContent} 
              disabled={isGeneratingContent}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingContent ? "Gerando..." : "Gerar conteúdo"}
            </Button>
          </div>
          <Textarea 
            placeholder="Insira instruções específicas para o assistente de IA (opcional). Por exemplo: 'Elabore um relatório detalhado focando na eficácia das ações para riscos'."
            className="mb-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            O assistente analisará os dados da sua análise crítica e gerará um relatório profissional e detalhado.
          </p>
        </div>
        
        <AnalysisReport analysis={analysis} ref={reportRef} />
        
        <DialogFooter className="mt-6 flex items-center justify-between sm:justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
