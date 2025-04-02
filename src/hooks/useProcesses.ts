
import { useState, useEffect } from "react";

// Mock data for processes
const processesData = [
  {
    id: 1,
    name: "Gestão de Vendas",
    description: "Processo de vendas e atendimento ao cliente",
    owner: "Departamento Comercial",
    status: "active",
    lastUpdated: "2023-10-15",
    indicators: [
      { id: 1, name: "Taxa de conversão", goal: "5%", current: "4.2%" },
      { id: 2, name: "Tempo médio de atendimento", goal: "15min", current: "18min" }
    ],
    documents: 5,
    risks: 2,
    type: "Comercial"
  },
  {
    id: 2,
    name: "Produção",
    description: "Processo de produção e manufatura",
    owner: "Departamento de Produção",
    status: "review",
    lastUpdated: "2023-09-22",
    indicators: [
      { id: 3, name: "Eficiência produtiva", goal: "85%", current: "82%" },
      { id: 4, name: "Taxa de defeitos", goal: "<2%", current: "1.8%" },
      { id: 5, name: "Tempo de setup", goal: "30min", current: "35min" }
    ],
    documents: 8,
    risks: 4,
    type: "Produção"
  },
  {
    id: 3,
    name: "Compras",
    description: "Processo de compras e suprimentos",
    owner: "Departamento de Suprimentos",
    status: "active",
    lastUpdated: "2023-10-05",
    indicators: [
      { id: 6, name: "Tempo de entrega", goal: "5 dias", current: "6 dias" },
      { id: 7, name: "Conformidade de fornecedores", goal: "95%", current: "93%" }
    ],
    documents: 3,
    risks: 1,
    type: "Suporte"
  },
  {
    id: 4,
    name: "Atendimento ao Cliente",
    description: "Processo de SAC e suporte",
    owner: "Departamento de Atendimento",
    status: "inactive",
    lastUpdated: "2023-08-30",
    indicators: [
      { id: 8, name: "Satisfação do cliente", goal: "4.5/5", current: "4.2/5" },
      { id: 9, name: "Tempo de resposta", goal: "24h", current: "30h" }
    ],
    documents: 2,
    risks: 3,
    type: "Comercial"
  },
];

interface Indicator {
  id: number;
  name: string;
  goal: string;
  current: string;
}

interface Process {
  id: number;
  name: string;
  description: string;
  owner: string;
  status: string;
  lastUpdated: string;
  indicators: Indicator[];
  documents: number;
  risks: number;
  type?: string;
}

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
    processTypes
  };
}
