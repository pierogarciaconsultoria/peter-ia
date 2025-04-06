
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogTitle } from "@/components/ui/dialog";
import { ProgressCircle } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { ExternalLink, Navigation } from "lucide-react";

// Mapeamento de requisitos para rotas do sistema
const requirementToRouteMap: Record<string, string | undefined> = {
  "4.1": "/organization-context", // Contexto da organização
  "4.2": "/organization-context",
  "4.3": "/strategic-planning", // Planejamento estratégico
  "4.4": "/processo", // Processos
  "5.1": "/critical-analysis", // Análise Crítica
  "5.2": "/strategic-planning", // Política e objetivos
  "5.3": "/human-resources", // Funções e responsabilidades
  "6.1": "/risk-management", // Gestão de riscos
  "6.2": "/performance-indicators", // Indicadores de desempenho
  "6.3": "/action-schedule", // Plano de ação
  "7.1": "/human-resources", // Recursos/Pessoas
  "7.2": "/human-resources", // Competência
  "7.5": "/documents", // Documentos
  "8.2": "/customer-complaints", // Reclamações de clientes
  "8.4": "/supplier-evaluation", // Avaliação de fornecedores
  "8.5": "/quality-control", // Controle de qualidade
  "8.7": "/non-conforming-products", // Produtos não conformes
  "9.1": "/performance-indicators", // Indicadores
  "9.2": "/audit-schedule", // Auditorias
  "9.3": "/critical-analysis", // Análise crítica
  "10.2": "/non-compliance", // Não conformidades 
  "10.3": "/action-schedule", // Plano de ação para melhoria contínua
};

interface RequirementHeaderProps {
  requirement: ISORequirement;
}

export const RequirementHeader = ({ requirement }: RequirementHeaderProps) => {
  // Verifica a rota correspondente para este requisito
  const correspondingRoute = requirementToRouteMap[requirement.number];
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <DialogTitle className="text-xl">
          {requirement.number} - {requirement.title}
        </DialogTitle>
        <ProgressCircle 
          progress={requirement.progress} 
          size={60} 
          color="bg-green-500"
        />
      </div>
      
      <p className="text-muted-foreground mb-4">
        {requirement.description}
      </p>
      
      {correspondingRoute && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 mt-2"
          asChild
        >
          <a href={correspondingRoute}>
            <Navigation className="h-4 w-4 mr-1" />
            Ir para aplicação relacionada
          </a>
        </Button>
      )}
    </div>
  );
};
