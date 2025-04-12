
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, User, MessageSquare, ArrowRight } from "lucide-react";

interface NonConformityListProps {
  status?: string;
}

export function NonConformityList({ status }: NonConformityListProps) {
  // Dados mockados de não conformidades
  const mockData = [
    {
      id: "NC-2025-001",
      title: "Falha no processo de embalagem",
      description: "Produtos sendo embalados com materiais inadequados",
      status: "open",
      date: "10/04/2025",
      department: "Produção",
      severity: "Alta",
      responsible: "Carlos Santos"
    },
    {
      id: "NC-2025-002",
      title: "Documentação desatualizada",
      description: "Procedimento operacional não está conforme versão atual",
      status: "analysis",
      date: "05/04/2025",
      department: "Qualidade",
      severity: "Média",
      responsible: "Ana Silva"
    },
    {
      id: "NC-2025-003",
      title: "Material fora das especificações",
      description: "Matéria-prima recebida com características fora do padrão",
      status: "action",
      date: "01/04/2025",
      department: "Almoxarifado",
      severity: "Alta",
      responsible: "Pedro Oliveira"
    },
    {
      id: "NC-2025-004",
      title: "Falha no treinamento de colaboradores",
      description: "Colaboradores sem treinamento adequado operando equipamentos",
      status: "closed",
      date: "15/03/2025",
      department: "RH",
      severity: "Média",
      responsible: "Mariana Costa"
    }
  ];
  
  // Filtra as não conformidades com base no status, se fornecido
  const filteredData = status 
    ? mockData.filter(item => item.status === status) 
    : mockData;
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <Badge variant="destructive">Em Aberto</Badge>;
      case "analysis":
        return <Badge variant="warning">Em Análise</Badge>;
      case "action":
        return <Badge variant="outline">Com Ação</Badge>;
      case "closed":
        return <Badge variant="success">Encerrada</Badge>;
      default:
        return <Badge>Indefinido</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      {filteredData.length === 0 ? (
        <div className="text-center p-8 bg-muted/20 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-2 text-lg font-medium">Nenhuma não conformidade encontrada</h3>
          <p className="text-sm text-muted-foreground">
            Não existem registros de não conformidades para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map(item => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{item.date}</span>
                  <span className="mx-2">•</span>
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>{item.responsible}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{item.department}</Badge>
                  <Badge variant="outline">Severidade: {item.severity}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <span>Detalhes</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
