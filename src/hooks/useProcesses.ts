
import { useState, useEffect } from "react";
import { Process, Indicator } from "@/types/processes";
import { toast } from "@/hooks/use-toast";

// Mock data for processes with new fields
const processesData: Process[] = [
  {
    id: 1,
    name: "Gestão de Vendas",
    description: "Processo de vendas e atendimento ao cliente",
    objective: "Garantir a eficiência nas vendas e satisfação dos clientes",
    owner: "Departamento Comercial",
    status: "active",
    lastUpdated: "2023-10-15",
    createdAt: "2023-09-01",
    version: "1.2",
    indicators: [
      { id: 1, name: "Taxa de conversão", goal: "5%", current: "4.2%" },
      { id: 2, name: "Tempo médio de atendimento", goal: "15min", current: "18min" }
    ],
    documents: 5,
    risks: 2,
    type: "Negócio",
    problems: ["Tempo de resposta elevado", "Baixa taxa de conversão"],
    processRisks: ["Perda de clientes para concorrência", "Insatisfação do cliente"],
    entryRequirements: ["Contato do cliente", "Catálogo de produtos atualizado"],
    expectedResult: "Venda concluída com satisfação do cliente"
  },
  {
    id: 2,
    name: "Produção",
    description: "Processo de produção e manufatura",
    objective: "Produzir com qualidade e eficiência conforme demanda",
    owner: "Departamento de Produção",
    status: "review",
    lastUpdated: "2023-09-22",
    createdAt: "2023-08-15",
    version: "2.0",
    indicators: [
      { id: 3, name: "Eficiência produtiva", goal: "85%", current: "82%" },
      { id: 4, name: "Taxa de defeitos", goal: "<2%", current: "1.8%" },
      { id: 5, name: "Tempo de setup", goal: "30min", current: "35min" }
    ],
    documents: 8,
    risks: 4,
    type: "Negócio",
    problems: ["Tempo de setup elevado", "Gargalos na linha de produção"],
    processRisks: ["Paradas não programadas", "Defeitos nos produtos"],
    entryRequirements: ["Matéria-prima", "Ordem de produção", "Planejamento"],
    expectedResult: "Produtos acabados conforme especificação e prazo"
  },
  {
    id: 3,
    name: "Compras",
    description: "Processo de compras e suprimentos",
    objective: "Adquirir materiais e serviços com qualidade e preço competitivo",
    owner: "Departamento de Suprimentos",
    status: "active",
    lastUpdated: "2023-10-05",
    createdAt: "2023-07-10",
    version: "1.5",
    indicators: [
      { id: 6, name: "Tempo de entrega", goal: "5 dias", current: "6 dias" },
      { id: 7, name: "Conformidade de fornecedores", goal: "95%", current: "93%" }
    ],
    documents: 3,
    risks: 1,
    type: "Apoio",
    problems: ["Atrasos de fornecedores", "Falta de qualificação de fornecedores"],
    processRisks: ["Desabastecimento", "Compras emergenciais com custo elevado"],
    entryRequirements: ["Requisição de compra", "Lista de fornecedores homologados"],
    expectedResult: "Material adquirido conforme especificação, prazo e custo"
  },
  {
    id: 4,
    name: "Atendimento ao Cliente",
    description: "Processo de SAC e suporte",
    objective: "Garantir suporte técnico e resolução rápida de problemas",
    owner: "Departamento de Atendimento",
    status: "draft",
    lastUpdated: "2023-08-30",
    createdAt: "2023-08-15",
    version: "0.9",
    indicators: [
      { id: 8, name: "Satisfação do cliente", goal: "4.5/5", current: "4.2/5" },
      { id: 9, name: "Tempo de resposta", goal: "24h", current: "30h" }
    ],
    documents: 2,
    risks: 3,
    type: "Negócio",
    problems: ["Tempo de espera elevado", "Falta de treinamento da equipe"],
    processRisks: ["Insatisfação do cliente", "Cancelamento de serviços"],
    entryRequirements: ["Registro de chamado", "Base de conhecimento"],
    expectedResult: "Cliente satisfeito com a resolução do problema"
  },
];

export function useProcesses() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [processTypes, setProcessTypes] = useState<string[]>([]);

  // Fetch processes
  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcesses(processesData);
        
        // Extract unique process types
        const types = Array.from(new Set(processesData.map(p => p.type).filter(Boolean))) as string[];
        setProcessTypes(types);
      } catch (error) {
        console.error("Error fetching processes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  // Filter processes based on search term and status
  const filteredProcesses = processes.filter(
    (process) =>
      (filterStatus === "all" || process.status === filterStatus) &&
      process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get a specific process by ID
  const getProcessById = (id: number) => {
    return processes.find(process => process.id === id);
  };

  // Add a new process
  const addProcess = (processData: any) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(...processes.map(p => p.id), 0) + 1;
    
    const newProcess: Process = {
      id: newId,
      name: processData.name,
      description: processData.description,
      objective: processData.objective,
      owner: processData.owner,
      status: processData.status || "draft",
      version: processData.version || "1.0",
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      indicators: processData.indicators || [],
      documents: Array.isArray(processData.documents) ? processData.documents.length : 0,
      risks: Array.isArray(processData.risks) ? processData.risks.length : 0,
      type: processData.type,
      problems: processData.problems || [],
      processRisks: processData.risks || [],
      entryRequirements: processData.entryRequirements || [],
      expectedResult: processData.expectedResult || ""
    };

    setProcesses(prevProcesses => [...prevProcesses, newProcess]);
    return newProcess;
  };

  // Update an existing process
  const updateProcess = (id: number, processData: any) => {
    setProcesses(prevProcesses => 
      prevProcesses.map(process => 
        process.id === id 
          ? {
              ...process,
              name: processData.name,
              description: processData.description,
              objective: processData.objective,
              owner: processData.owner,
              status: processData.status || process.status,
              version: processData.version || process.version,
              lastUpdated: new Date().toISOString().split("T")[0],
              indicators: processData.indicators || process.indicators,
              documents: Array.isArray(processData.documents) ? processData.documents.length : process.documents,
              risks: Array.isArray(processData.risks) ? processData.risks.length : process.risks,
              type: processData.type || process.type,
              problems: processData.problems || process.problems,
              processRisks: processData.risks || process.processRisks,
              entryRequirements: processData.entryRequirements || process.entryRequirements,
              expectedResult: processData.expectedResult || process.expectedResult
            }
          : process
      )
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  return {
    processes: filteredProcesses,
    allProcesses: processes,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    isLoading,
    clearFilters,
    getProcessById,
    addProcess,
    updateProcess,
    processTypes
  };
}
