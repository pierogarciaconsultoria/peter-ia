
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { useProcesses } from "@/hooks/useProcesses";
import { ProcessHeader } from "@/components/processes/ProcessHeader";
import { ProcessSearchFilter } from "@/components/processes/ProcessSearchFilter";
import { ProcessList } from "@/components/processes/ProcessList";

const ProcessoPage = () => {
  const navigate = useNavigate();
  const { 
    processes, 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus, 
    isLoading,
    clearFilters
  } = useProcesses();

  // Function to handle creating a new process
  const handleNewProcess = () => {
    navigate("/processo/novo");
  };

  // Function to view process details
  const handleViewProcess = (id: number) => {
    toast.info(`Visualizando processo ${id}`, {
      description: "Detalhes do processo serão exibidos em breve.",
    });
    // Future implementation: navigate(`/processo/${id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <ProcessHeader handleNewProcess={handleNewProcess} />
          <ProcessSearchFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <ProcessList 
            processes={processes}
            isLoading={isLoading}
            handleViewProcess={handleViewProcess}
            clearFilters={clearFilters}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProcessoPage;
