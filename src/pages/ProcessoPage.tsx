
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProcesses } from "@/hooks/useProcesses";
import { ProcessHeader } from "@/components/processes/ProcessHeader";
import { ProcessSearchFilter } from "@/components/processes/ProcessSearchFilter";
import { ProcessList } from "@/components/processes/ProcessList";
import { MacroProcessDialog } from "@/components/processes/MacroProcessDialog";
import { Process } from "@/types/processes";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

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
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
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
            processes={processes as Process[]}
            processType={selectedProcessType}
          />
        </div>
      </div>
    </AuthenticationRequired>
  );
};

export default ProcessoPage;
