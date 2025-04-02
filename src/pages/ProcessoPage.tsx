
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { useProcesses } from "@/hooks/useProcesses";
import { ProcessHeader } from "@/components/processes/ProcessHeader";
import { ProcessSearchFilter } from "@/components/processes/ProcessSearchFilter";
import { ProcessList } from "@/components/processes/ProcessList";
import { MacroProcessDialog } from "@/components/processes/MacroProcessDialog";

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
  
  const [showMacroProcess, setShowMacroProcess] = useState(false);
  const [selectedProcessType, setSelectedProcessType] = useState<string | null>(null);

  // Function to handle creating a new process
  const handleNewProcess = () => {
    navigate("/processo/novo");
  };

  // Function to view process details
  const handleViewProcess = (id: number) => {
    navigate(`/processo/${id}`);
  };
  
  // Function to open the macro process dialog
  const handleMacroProcess = () => {
    if (processes.length === 0) {
      toast.info("Não há processos para exibir no diagrama de Macro Processo");
    } else {
      setShowMacroProcess(true);
    }
  };
  
  // Function to view macro process by type
  const handleViewMacroProcessByType = (type: string) => {
    setSelectedProcessType(type);
    setShowMacroProcess(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <ProcessHeader 
            handleNewProcess={handleNewProcess} 
            handleMacroProcess={handleMacroProcess}
          />
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
            onViewMacroProcessByType={handleViewMacroProcessByType}
          />
          
          <MacroProcessDialog
            open={showMacroProcess}
            onClose={() => {
              setShowMacroProcess(false);
              setSelectedProcessType(null);
            }}
            processes={processes}
            processType={selectedProcessType}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProcessoPage;
