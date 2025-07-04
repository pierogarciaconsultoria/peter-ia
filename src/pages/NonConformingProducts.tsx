import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Clock, Filter, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dashboard } from "@/components/Dashboard";
import { isoRequirements } from "@/utils/isoRequirements";
import NonConformingProductForm from "@/components/NonConformingProductForm";
import { NonConformingProductsDashboard } from "@/components/NonConformingProductsDashboard";

type NonConformingProduct = {
  id: string;
  product_name: string;
  description: string;
  status: "identified" | "isolated" | "reviewed" | "resolved";
  severity: "low" | "medium" | "high";
  created_at: string;
  requirement_id: string;
  department: string;
  customer: string;
  non_conformity_type: string;
  immediate_action: string;
  approval_status: "approved" | "rejected" | "pending";
};

const fetchNonConformingProducts = async () => {
  // This would normally fetch from the database
  // For now, we'll return mock data
  const mockData: NonConformingProduct[] = [
    {
      id: "1",
      product_name: "Produto A-123",
      description: "Falha no acabamento da superfície identificada durante inspeção final.",
      status: "identified",
      severity: "high",
      created_at: new Date().toISOString(),
      requirement_id: "8.7",
      department: "Produção",
      customer: "Cliente A",
      non_conformity_type: "Defeito de acabamento",
      immediate_action: "Segregação",
      approval_status: "pending"
    },
    {
      id: "2",
      product_name: "Componente B-456",
      description: "Dimensões fora da especificação tolerada. Produto isolado para análise de causa raiz.",
      status: "isolated",
      severity: "medium",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7.1",
      department: "Controle de Qualidade",
      customer: "Cliente B",
      non_conformity_type: "Dimensão incorreta",
      immediate_action: "Retrabalho",
      approval_status: "approved"
    },
    {
      id: "3",
      product_name: "Conjunto C-789",
      description: "Falta de conformidade com especificações técnicas. Analisado e aprovado com concessão.",
      status: "reviewed",
      severity: "low",
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7.2",
      department: "Engenharia",
      customer: "Cliente A",
      non_conformity_type: "Especificação técnica",
      immediate_action: "Concessão",
      approval_status: "approved"
    },
    {
      id: "4",
      product_name: "Peça D-012",
      description: "Problema de qualidade resolvido após retrabalho. Liberado para uso.",
      status: "resolved",
      severity: "medium",
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7",
      department: "Produção",
      customer: "Cliente C",
      non_conformity_type: "Problema de qualidade",
      immediate_action: "Retrabalho",
      approval_status: "approved"
    },
    {
      id: "5",
      product_name: "Módulo E-345",
      description: "Componente com falha funcional detectada em teste.",
      status: "identified",
      severity: "high",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7",
      department: "Teste",
      customer: "Cliente D",
      non_conformity_type: "Falha funcional",
      immediate_action: "Segregação",
      approval_status: "rejected"
    },
    {
      id: "6",
      product_name: "Conjunto F-678",
      description: "Desalinhamento de componentes durante montagem.",
      status: "isolated",
      severity: "medium",
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7.1",
      department: "Montagem",
      customer: "Cliente B",
      non_conformity_type: "Problema de montagem",
      immediate_action: "Desmontagem e remontagem",
      approval_status: "approved"
    },
    {
      id: "7",
      product_name: "Produto A-123",
      description: "Matéria-prima fora das especificações.",
      status: "reviewed",
      severity: "high",
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      requirement_id: "8.7.2",
      department: "Almoxarifado",
      customer: "Cliente A",
      non_conformity_type: "Matéria-prima não conforme",
      immediate_action: "Devolução ao fornecedor",
      approval_status: "approved"
    }
  ];
  
  return mockData;
};

const NonConformingProducts = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  
  const { data: nonConformingProducts = [], isLoading, error } = useQuery({
    queryKey: ["nonConformingProducts"],
    queryFn: fetchNonConformingProducts
  });
  
  const filteredProducts = statusFilter 
    ? nonConformingProducts.filter(item => item.status === statusFilter)
    : nonConformingProducts;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "identified":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "isolated":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "reviewed":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "identified":
        return "Identificado";
      case "isolated":
        return "Isolado";
      case "reviewed":
        return "Analisado";
      case "resolved":
        return "Resolvido";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Layout padrão: max-w-6xl, centralizado, padding */}
      <div className="max-w-6xl w-full mx-auto flex flex-col p-6 gap-6 flex-1">
        <header>
          <h1 className="text-3xl font-bold mb-1">Controle de Produto Não Conforme</h1>
          <p className="text-muted-foreground mb-6">
            Registre, monitore e visualize os produtos não conformes detectados nos processos da empresa.
          </p>
        </header>
        
        {/* Dashboard section (imported from Index page) */}
        <Dashboard requirements={isoRequirements} />
          
        <div className="flex flex-col sm:flex-row items-center justify-between my-4 gap-3">
          <div className="flex gap-2">
            <Button 
              variant={showDashboard ? "default" : "outline"}
              onClick={() => setShowDashboard(true)}
            >
              Dashboard
            </Button>
            <Button 
              variant={!showDashboard ? "default" : "outline"}
              onClick={() => setShowDashboard(false)}
            >
              Listagem
            </Button>
          </div>
          <Button onClick={() => setRegisterFormOpen(true)}>
            <Package size={16} className="mr-2" />
            Registrar Produto Não Conforme
          </Button>
        </div>
          
        {showDashboard ? (
          <NonConformingProductsDashboard products={nonConformingProducts} />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm font-medium mr-2">Filtrar por status:</span>
              <Button 
                variant={statusFilter === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                Todos
              </Button>
              <Button 
                variant={statusFilter === "identified" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("identified")}
              >
                Identificados
              </Button>
              <Button 
                variant={statusFilter === "isolated" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("isolated")}
              >
                Isolados
              </Button>
              <Button 
                variant={statusFilter === "reviewed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("reviewed")}
              >
                Analisados
              </Button>
              <Button 
                variant={statusFilter === "resolved" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("resolved")}
              >
                Resolvidos
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">Carregando...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">Erro ao carregar dados</div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <CardTitle className="text-lg">{item.product_name}</CardTitle>
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
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Nenhum produto não conforme encontrado</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {/* Non-conforming Product Registration Form */}
      <NonConformingProductForm
        open={registerFormOpen}
        onOpenChange={setRegisterFormOpen}
      />
    </div>
  );
};

export default NonConformingProducts;
