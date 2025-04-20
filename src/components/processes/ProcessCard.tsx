
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Process } from "@/types/processes";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ProcessCardProps {
  process: Process;
  handleViewProcess: (id: number) => void;
  onViewMacroProcessByType?: (type: string) => void;
}

export function ProcessCard({ process, handleViewProcess, onViewMacroProcessByType }: ProcessCardProps) {
  const statusColors = {
    active: "bg-green-500",
    approved: "bg-green-500",
    review: "bg-amber-500",
    draft: "bg-blue-500",
    pending: "bg-amber-500", 
    rejected: "bg-red-500",
    inactive: "bg-red-500",
  };
  
  const statusColor = statusColors[process.status as keyof typeof statusColors] || "bg-gray-500";
  const formattedDate = process.lastUpdated ? new Date(process.lastUpdated).toLocaleDateString() : "N/A";
  const typeBadgeColor = {
    "Gestão": "bg-purple-100 text-purple-800",
    "Negócio": "bg-blue-100 text-blue-800",
    "Apoio": "bg-green-100 text-green-800",
  };

  const statusText = {
    active: "Ativo",
    approved: "Aprovado",
    review: "Em Revisão",
    draft: "Rascunho",
    pending: "Pendente",
    rejected: "Rejeitado",
    inactive: "Inativo",
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground">
                    {statusText[process.status as keyof typeof statusText] || process.status}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Status do processo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            {process.type && (
              <Badge className={typeBadgeColor[process.type as keyof typeof typeBadgeColor]}>
                {process.type}
              </Badge>
            )}
            <CardDescription>{formattedDate}</CardDescription>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold">{process.name}</CardTitle>
        <CardDescription className="line-clamp-2">{process.description || process.objective}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Responsável:</span>
            <span className="font-medium text-foreground">{process.owner}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Indicadores:</span>
            <span className="font-medium text-foreground">{process.indicators?.length || 0}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Documentos:</span>
            <span className="font-medium text-foreground">{process.documents}</span>
          </div>
          <div className="flex justify-between">
            <span>Riscos:</span>
            <span className="font-medium text-foreground">{process.risks}</span>
          </div>
          {process.version && (
            <div className="flex justify-between mt-1">
              <span>Versão:</span>
              <span className="font-medium text-foreground">{process.version}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => process.type && onViewMacroProcessByType?.(process.type)}
        >
          Macro Processo
        </Button>
        <Button 
          size="sm"
          onClick={() => handleViewProcess(process.id)}
        >
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
