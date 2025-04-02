
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GitBranch,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for processes
const processes = [
  {
    id: 1,
    name: "Gestão de Vendas",
    description: "Processo de vendas e atendimento ao cliente",
    owner: "Departamento Comercial",
    status: "active",
    lastUpdated: "2023-10-15",
    indicators: 3,
    documents: 5,
    risks: 2,
  },
  {
    id: 2,
    name: "Produção",
    description: "Processo de produção e manufatura",
    owner: "Departamento de Produção",
    status: "review",
    lastUpdated: "2023-09-22",
    indicators: 5,
    documents: 8,
    risks: 4,
  },
  {
    id: 3,
    name: "Compras",
    description: "Processo de compras e suprimentos",
    owner: "Departamento de Suprimentos",
    status: "active",
    lastUpdated: "2023-10-05",
    indicators: 2,
    documents: 3,
    risks: 1,
  },
  {
    id: 4,
    name: "Atendimento ao Cliente",
    description: "Processo de SAC e suporte",
    owner: "Departamento de Atendimento",
    status: "inactive",
    lastUpdated: "2023-08-30",
    indicators: 4,
    documents: 2,
    risks: 3,
  },
];

const ProcessoPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter processes based on search term and status
  const filteredProcesses = processes.filter(
    (process) =>
      (filterStatus === "all" || process.status === filterStatus) &&
      process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle creating a new process
  const handleNewProcess = () => {
    navigate("/processo/novo");
  };

  // Function to view process details
  const handleViewProcess = (id) => {
    toast.info(`Visualizando processo ${id}`, {
      description: "Detalhes do processo serão exibidos em breve.",
    });
    // Future implementation: navigate(`/processo/${id}`);
  };

  // Function to get status color
  const getStatusColor = (status) => {
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
  const getStatusText = (status) => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <GitBranch className="mr-2 h-6 w-6" /> Gestão de Processos
              </h1>
              <p className="text-muted-foreground mt-1">
                Mapeie, documente e monitore os processos da organização
              </p>
            </div>
            <Button className="mt-4 md:mt-0" onClick={handleNewProcess}>
              <Plus className="mr-2 h-4 w-4" /> Novo Processo
            </Button>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar processos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="opacity-70 animate-pulse">
                  <CardHeader className="h-24"></CardHeader>
                  <CardContent className="h-32"></CardContent>
                  <CardFooter className="h-16"></CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProcesses.map((process) => (
                <Card key={process.id} className="hover:shadow-md transition-shadow">
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
              ))}
            </div>
          )}

          {!isLoading && filteredProcesses.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-muted-foreground">
                Nenhum processo encontrado com os filtros atuais.
              </p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProcessoPage;
