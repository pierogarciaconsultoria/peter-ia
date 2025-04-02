
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

interface Process {
  id: number;
  name: string;
  description: string;
  owner: string;
  status: string;
  lastUpdated: string;
  indicators: number;
  documents: number;
  risks: number;
}

export function useProcesses() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch processes
  useEffect(() => {
    const fetchProcesses = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcesses(processesData);
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
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    isLoading,
    clearFilters,
    getProcessById,
  };
}
