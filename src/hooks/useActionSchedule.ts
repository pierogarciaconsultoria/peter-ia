
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllActions, deleteAction } from "@/services/actionService";
import { useToast } from "@/hooks/use-toast";
import { Action5W2H, ActionStatus, ProcessArea, ActionSource } from "@/types/actions";
import { exportActionsToPDF } from "@/components/actions/utils/pdf-export";
import { toast } from "sonner";

export type ViewFormat = 'table' | 'kanban' | 'gantt' | 'responsible';

export function useActionSchedule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action5W2H | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all");
  const [processFilter, setProcessFilter] = useState<ProcessArea | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ActionSource | "all">("all");
  
  // View format state
  const [viewFormat, setViewFormat] = useState<ViewFormat>('table');
  
  // Fetch all actions
  const { 
    data: actions = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["actions"],
    queryFn: getAllActions,
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
      toast({
        title: "Ação excluída",
        description: "A ação foi excluída com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error deleting action:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a ação",
        variant: "destructive",
      });
    }
  });
  
  // Handlers
  const handleEdit = (action: Action5W2H) => {
    setSelectedAction(action);
    setIsEditDialogOpen(true);
  };
  
  const handleView = (action: Action5W2H) => {
    setSelectedAction(action);
    setIsViewDialogOpen(true);
  };
  
  const handleDelete = (action: Action5W2H) => {
    if (confirm(`Tem certeza que deseja excluir a ação "${action.title}"?`)) {
      deleteMutation.mutate(action.id);
    }
  };
  
  // Filter actions
  const filteredActions = actions.filter(action => {
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    const matchesProcess = processFilter === "all" || action.process_area === processFilter;
    const matchesSource = sourceFilter === "all" || action.source === sourceFilter;
    return matchesStatus && matchesProcess && matchesSource;
  });
  
  // Count status
  const countByStatus = (status: ActionStatus) => {
    return actions.filter(action => action.status === status).length;
  };
  
  const statusCounts = {
    planned: countByStatus("planned"),
    in_progress: countByStatus("in_progress"),
    completed: countByStatus("completed"),
    delayed: countByStatus("delayed"),
    cancelled: countByStatus("cancelled")
  };

  const invalidateActions = () => {
    queryClient.invalidateQueries({ queryKey: ["actions"] });
  };
  
  // Export to PDF
  const handleExportToPDF = async () => {
    try {
      await exportActionsToPDF(filteredActions, { 
        status: statusFilter, 
        process: processFilter, 
        source: sourceFilter 
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Ocorreu um erro ao exportar para PDF");
    }
  };
  
  return {
    actions,
    filteredActions,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    processFilter,
    setProcessFilter,
    sourceFilter,
    setSourceFilter,
    handleEdit,
    handleView,
    handleDelete,
    isAddDialogOpen, 
    setIsAddDialogOpen,
    isEditDialogOpen, 
    setIsEditDialogOpen,
    isViewDialogOpen, 
    setIsViewDialogOpen,
    selectedAction,
    statusCounts,
    invalidateActions,
    viewFormat,
    setViewFormat,
    handleExportToPDF
  };
}
