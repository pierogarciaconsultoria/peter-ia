
import { FC } from "react";
import { ISORequirement } from "@/utils/isoRequirements";
import { ProgressCircle } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface RequirementCardProps {
  requirement: ISORequirement;
  index: number;
  onClick: (requirement: ISORequirement) => void;
}

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

export const RequirementCard: FC<RequirementCardProps> = ({
  requirement,
  index,
  onClick,
}) => {
  // Verifica a rota correspondente para este requisito
  const correspondingRoute = requirementToRouteMap[requirement.number];

  return (
    <div 
      className="bg-card border rounded-lg p-6 hover:shadow-md transition duration-200 appear-animate"
      style={{ "--delay": index } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight">
            {requirement.number} - {requirement.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {requirement.description.length > 120 
              ? `${requirement.description.substring(0, 120)}...` 
              : requirement.description
            }
          </p>
        </div>
        <ProgressCircle 
          progress={requirement.progress} 
          size={50} 
          color="bg-green-500"
        />
      </div>

      <div className="flex justify-between mt-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onClick(requirement)}
        >
          Ver Detalhes
        </Button>
        
        {correspondingRoute && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            asChild
          >
            <a href={correspondingRoute}>
              <Navigation className="h-4 w-4 mr-1" />
              Ver Aplicação
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
