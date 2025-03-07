
import { Button } from "@/components/ui/button";
import { ISORequirement } from "@/utils/isoRequirements";
import { Download, FileText } from "lucide-react";

interface DocumentTemplateProps {
  requirement: ISORequirement;
}

export function DocumentTemplate({ requirement }: DocumentTemplateProps) {
  // Function to generate PDF template (this would be expanded in a real implementation)
  const handleDownloadTemplate = () => {
    // This would be replaced with actual PDF generation code
    console.log(`Downloading template for requirement ${requirement.number}`);
    // For now, we'll just show an alert
    alert(`Template for ${requirement.number} - ${requirement.title} would be downloaded here`);
  };

  return (
    <div className="mt-4">
      <div className="border rounded-lg p-6 bg-white">
        {/* Header with logo and requirement title */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <img 
              src="/lovable-uploads/16051b9e-cfae-479a-8e59-7b089b005ce7.png" 
              alt="Piero Garcia Logo" 
              className="h-16 object-contain"
            />
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-lg">{requirement.number}</h3>
            <h2 className="font-bold text-xl">{requirement.title}</h2>
          </div>
        </div>
        
        {/* Template content - this would be customized per requirement in a real implementation */}
        <div className="min-h-[400px] border-dashed border p-4 rounded-lg mb-4">
          <h3 className="font-medium text-lg mb-2">Formulário para {requirement.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Este formulário atende às exigências do requisito {requirement.number} da ISO 9001:2015
          </p>
          
          {/* Template content would vary by requirement */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="text-sm font-medium">Descrição do Propósito:</p>
              <p className="text-sm text-muted-foreground">{requirement.description}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Campos Relevantes:</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {getFieldsForRequirement(requirement.number).map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer with contact information */}
        <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="space-y-1 text-center sm:text-left mb-2 sm:mb-0">
            <p>www.pierogarcia.com.br</p>
            <p>contato@pierogarcia.com.br</p>
            <p>@pierogarciaconsultoria</p>
          </div>
          <div>
            <Button onClick={handleDownloadTemplate} className="w-full sm:w-auto">
              <Download size={16} className="mr-2" />
              Baixar Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine fields based on ISO requirement
function getFieldsForRequirement(requirementNumber: string): string[] {
  switch(requirementNumber) {
    case "4.1":
      return [
        "Questões internas e externas relevantes",
        "Impacto nos resultados do SGQ",
        "Método de monitoramento e revisão"
      ];
    case "4.2":
      return [
        "Partes interessadas relevantes",
        "Requisitos das partes interessadas",
        "Impacto no SGQ",
        "Método de monitoramento e revisão"
      ];
    case "4.3":
      return [
        "Escopo do SGQ",
        "Produtos e serviços cobertos",
        "Justificativa para requisitos não aplicáveis"
      ];
    case "4.4":
      return [
        "Processos necessários para o SGQ",
        "Sequência e interação dos processos",
        "Critérios e métodos de controle",
        "Recursos necessários",
        "Responsabilidades e autoridades"
      ];
    case "5.1":
      return [
        "Evidências de comprometimento da liderança",
        "Foco no cliente",
        "Comunicação da política da qualidade"
      ];
    case "5.2":
      return [
        "Política da qualidade",
        "Método de comunicação",
        "Data de aprovação",
        "Assinatura da alta direção"
      ];
    case "5.3":
      return [
        "Funções organizacionais",
        "Responsabilidades",
        "Autoridades",
        "Comunicação"
      ];
    case "6.1":
      return [
        "Riscos identificados",
        "Oportunidades identificadas",
        "Ações planejadas",
        "Método de avaliação da eficácia"
      ];
    case "6.2":
      return [
        "Objetivos da qualidade",
        "Plano de ação",
        "Recursos necessários",
        "Responsáveis",
        "Prazos",
        "Método de avaliação"
      ];
    case "6.3":
      return [
        "Mudança proposta",
        "Propósito da mudança",
        "Potenciais consequências",
        "Recursos necessários",
        "Responsabilidades",
        "Autorização"
      ];
    case "7.1":
      return [
        "Recursos necessários",
        "Pessoas",
        "Infraestrutura",
        "Ambiente",
        "Recursos de monitoramento e medição",
        "Conhecimento organizacional"
      ];
    case "7.2":
      return [
        "Competências necessárias",
        "Educação",
        "Treinamento",
        "Experiência",
        "Ações para adquirir competências",
        "Avaliação da eficácia"
      ];
    // Add more cases as needed for other requirements
    default:
      return [
        "Campo 1 específico do requisito",
        "Campo 2 específico do requisito",
        "Campo 3 específico do requisito",
        "Campo 4 específico do requisito"
      ];
  }
}
