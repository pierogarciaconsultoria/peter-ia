
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type NonCompliance = {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  severity: "low" | "medium" | "high";
  created_at: string;
  requirement_id: string;
};

const fetchNonCompliances = async () => {
  // This would normally fetch from the database
  // For now, we'll return mock data
  const mockData: NonCompliance[] = [
    {
      id: "1",
      title: "Falta de documentação do processo de produção",
      description: "Durante a auditoria foi verificado que o processo de produção não possui documentação adequada conforme requisito 4.4.1.",
      status: "open",
      severity: "high",
      created_at: new Date().toISOString(),
      requirement_id: "4.4.1"
    },
    {
      id: "2",
      title: "Calibração de instrumentos em atraso",
      description: "Identificados 3 instrumentos de medição com calibração vencida há mais de 60 dias.",
      status: "in_progress",
      severity: "medium",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "7.1.5"
    },
    {
      id: "3",
      title: "Registro de treinamento incompleto",
      description: "Funcionários do setor de montagem sem registro de treinamento na nova instrução de trabalho IT-001.",
      status: "closed",
      severity: "low",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "7.2"
    }
  ];
  
  return mockData;
};

const NonCompliance = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: nonCompliances = [], isLoading, error } = useQuery({
    queryKey: ["nonCompliances"],
    queryFn: fetchNonCompliances
  });
  
  const filteredNonCompliances = statusFilter 
    ? nonCompliances.filter(item => item.status === statusFilter)
    : nonCompliances;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "closed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Aberta";
      case "in_progress":
        return "Em Andamento";
      case "closed":
        return "Concluída";
      default:
        return status;
    }
  };
  
  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "Baixa";
      case "medium":
        return "Média";
      case "high":
        return "Alta";
      default:
        return severity;
    }
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Não Conformidades</h1>
          <Button>Nova Não Conformidade</Button>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium mr-2">Filtrar por status:</span>
          <Button 
            variant={statusFilter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            Todos
          </Button>
          <Button 
            variant={statusFilter === "open" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("open")}
          >
            Abertas
          </Button>
          <Button 
            variant={statusFilter === "in_progress" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("in_progress")}
          >
            Em Andamento
          </Button>
          <Button 
            variant={statusFilter === "closed" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("closed")}
          >
            Concluídas
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">Carregando...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Erro ao carregar dados</div>
        ) : (
          <div className="grid gap-4">
            {filteredNonCompliances.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityClass(item.severity)}`}>
                      {getSeverityLabel(item.severity)}
                    </div>
                  </div>
                  <CardDescription className="flex items-center justify-between">
                    <span>Requisito: {item.requirement_id}</span>
                    <span>Data: {formatDate(item.created_at)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
                <CardFooter className="bg-muted/50 flex justify-between pt-2">
                  <span className="text-sm flex items-center gap-1">
                    Status: <span className="font-medium">{getStatusLabel(item.status)}</span>
                  </span>
                  <Button size="sm" variant="outline">Ver Detalhes</Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredNonCompliances.length === 0 && (
              <div className="text-center py-10 bg-muted rounded-lg">
                <p className="text-muted-foreground">Nenhuma não conformidade encontrada</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NonCompliance;
