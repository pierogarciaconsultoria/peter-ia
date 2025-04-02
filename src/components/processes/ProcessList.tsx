
import React from "react";
import { ProcessCard } from "@/components/processes/ProcessCard";
import { ProcessEmptyState } from "@/components/processes/ProcessEmptyState";
import { ProcessLoading } from "@/components/processes/ProcessLoading";
import { Process } from "@/types/processes";

interface ProcessListProps {
  processes: Process[];
  isLoading: boolean;
  handleViewProcess: (id: number) => void;
  clearFilters: () => void;
  onViewMacroProcessByType?: (type: string) => void;
}

export function ProcessList({ 
  processes, 
  isLoading, 
  handleViewProcess,
  clearFilters,
  onViewMacroProcessByType
}: ProcessListProps) {
  if (isLoading) {
    return <ProcessLoading />;
  }

  if (processes.length === 0) {
    return <ProcessEmptyState clearFilters={clearFilters} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {processes.map((process) => (
        <ProcessCard 
          key={process.id} 
          process={process} 
          handleViewProcess={handleViewProcess} 
          onViewMacroProcessByType={onViewMacroProcessByType}
        />
      ))}
    </div>
  );
}
