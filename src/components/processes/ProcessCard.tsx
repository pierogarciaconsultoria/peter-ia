
import React from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProcessCardProps {
  process: {
    id: number;
    name: string;
    description: string;
    owner: string;
    status: string;
    lastUpdated: string;
    indicators: number;
    documents: number;
    risks: number;
  };
  handleViewProcess: (id: number) => void;
}

export function ProcessCard({ process, handleViewProcess }: ProcessCardProps) {
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-amber-100 text-amber-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "review":
        return "Em Revisão";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{process.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {process.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewProcess(process.id)}>
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Exportar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Responsável:</span>
            <span>{process.owner}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Última atualização:</span>
            <span>{process.lastUpdated}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(process.status)}`}>
              {getStatusText(process.status)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full text-sm">
          <div className="flex items-center">
            <span className="font-medium mr-1">{process.indicators}</span>
            <span className="text-muted-foreground">Indicadores</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-1">{process.documents}</span>
            <span className="text-muted-foreground">Documentos</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-1">{process.risks}</span>
            <span className="text-muted-foreground">Riscos</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
