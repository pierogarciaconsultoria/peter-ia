
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

interface ProcessCardProps {
  process: Process;
  handleViewProcess: (id: number) => void;
  onViewMacroProcessByType?: (type: string) => void;
}

export function ProcessCard({ process, handleViewProcess, onViewMacroProcessByType }: ProcessCardProps) {
  const statusColors = {
    active: "bg-green-500",
    review: "bg-amber-500",
    inactive: "bg-red-500",
  };
  
  const statusColor = statusColors[process.status as keyof typeof statusColors] || "bg-gray-500";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
          <CardDescription>{new Date(process.lastUpdated).toLocaleDateString()}</CardDescription>
        </div>
        <CardTitle className="text-lg font-semibold">{process.name}</CardTitle>
        <CardDescription className="line-clamp-2">{process.description}</CardDescription>
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
