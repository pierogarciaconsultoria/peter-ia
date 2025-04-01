
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useOccurrences } from "@/hooks/useOccurrences";
import { NewOccurrenceDialog } from "./occurrences/NewOccurrenceDialog";
import { OccurrenceStats } from "./occurrences/OccurrenceStats";
import { OccurrenceFilters } from "./occurrences/OccurrenceFilters";
import { OccurrenceTable } from "./occurrences/OccurrenceTable";
import { RecentOccurrences } from "./occurrences/RecentOccurrences";
import { filterOccurrences } from "./occurrences/utils";

export function OccurrenceManagement() {
  const { occurrences, isLoading } = useOccurrences();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewDialog, setShowNewDialog] = useState<boolean>(false);

  // Filter occurrences based on search query and filters
  const filteredOccurrences = filterOccurrences(
    occurrences, 
    searchQuery, 
    typeFilter, 
    statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestão de Ocorrências</h2>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>
      
      <OccurrenceStats occurrences={occurrences} />

      <OccurrenceFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <OccurrenceTable 
        occurrences={filteredOccurrences} 
        isLoading={isLoading} 
      />
      
      <RecentOccurrences occurrences={occurrences} />

      <NewOccurrenceDialog 
        isOpen={showNewDialog}
        onClose={() => setShowNewDialog(false)}
      />
    </div>
  );
}
