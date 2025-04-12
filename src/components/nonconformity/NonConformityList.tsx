
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FileText, AlertCircle, CheckCircle, Trash2, PenSquare, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type NonConformityItem = {
  id: number;
  title: string;
  date: string;
  department: string;
  status: string;
  description: string;
};

interface NonConformityListProps {
  onView?: (item: NonConformityItem) => void;
  onEdit?: (item: NonConformityItem) => void;
  onDelete?: (item: NonConformityItem) => void;
}

export function NonConformityList({ onView, onEdit, onDelete }: NonConformityListProps) {
  const [nonConformities, setNonConformities] = useState<NonConformityItem[]>([
    {
      id: 1,
      title: "Falha no processo de embalagem",
      date: "2025-03-15",
      department: "Produção",
      status: "Em análise",
      description: "Produtos sendo embalados com defeitos visíveis na linha de produção 2."
    },
    {
      id: 2,
      title: "Desvio de temperatura no armazenamento",
      date: "2025-03-10",
      department: "Logística",
      status: "Em tratamento",
      description: "Temperatura fora dos limites aceitáveis no armazém de produtos perecíveis."
    },
    {
      id: 3,
      title: "Reclamação de cliente - produto defeituoso",
      date: "2025-03-05",
      department: "Qualidade",
      status: "Concluído",
      description: "Cliente relatou falha no funcionamento do produto após primeira utilização."
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Em análise":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            {status}
          </Badge>
        );
      case "Em tratamento":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            {status}
          </Badge>
        );
      case "Concluído":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nonConformities.map((item) => (
        <Card key={item.id} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onView && onView(item)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit && onEdit(item)}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete && onDelete(item)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {getStatusBadge(item.status)}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="mr-1 h-4 w-4" />
                <span>Departamento: {item.department}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Data: {new Date(item.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-sm line-clamp-2">{item.description}</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={() => onView && onView(item)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Detalhes
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
