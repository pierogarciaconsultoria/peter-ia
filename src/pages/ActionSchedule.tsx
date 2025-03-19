
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilterIcon, AlertCircle } from "lucide-react";
import { ActionTable } from "@/components/actions/ActionTable";
import { ActionForm } from "@/components/actions/ActionForm";
import { ActionDetails } from "@/components/actions/ActionDetails";
import { getAllActions, deleteAction } from "@/services/actionService";
import { Action5W2H, ActionStatus, ProcessArea } from "@/types/actions";
import { useToast } from "@/hooks/use-toast";

const ActionSchedule = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action5W2H | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all");
  const [processFilter, setProcessFilter] = useState<ProcessArea | "all">("all");
  
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
    return matchesStatus && matchesProcess;
  });
  
  // Count status
  const countByStatus = (status: ActionStatus) => {
    return actions.filter(action => action.status === status).length;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Cronograma de Ação</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Ação
                </Button>
              </DialogTrigger>
              <ActionForm 
                onClose={() => setIsAddDialogOpen(false)} 
                afterSubmit={() => queryClient.invalidateQueries({ queryKey: ["actions"] })}
              />
            </Dialog>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Acompanhe o cronograma de ações planejadas e monitore o progresso das atividades utilizando a metodologia 5W2H.
          </p>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div 
              className={`bg-white p-4 rounded-lg border ${statusFilter === "all" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
              onClick={() => setStatusFilter("all")}
            >
              <h3 className="font-medium text-lg">{actions.length}</h3>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            
            <div 
              className={`bg-white p-4 rounded-lg border ${statusFilter === "planned" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
              onClick={() => setStatusFilter("planned")}
            >
              <h3 className="font-medium text-lg">{countByStatus("planned")}</h3>
              <p className="text-sm text-muted-foreground">Planejadas</p>
            </div>
            
            <div 
              className={`bg-white p-4 rounded-lg border ${statusFilter === "in_progress" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
              onClick={() => setStatusFilter("in_progress")}
            >
              <h3 className="font-medium text-lg">{countByStatus("in_progress")}</h3>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
            
            <div 
              className={`bg-white p-4 rounded-lg border ${statusFilter === "completed" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
              onClick={() => setStatusFilter("completed")}
            >
              <h3 className="font-medium text-lg">{countByStatus("completed")}</h3>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
            
            <div 
              className={`bg-white p-4 rounded-lg border ${statusFilter === "delayed" ? "border-primary" : "border-gray-200"} shadow-sm cursor-pointer transition-all hover:shadow-md`}
              onClick={() => setStatusFilter("delayed")}
            >
              <h3 className="font-medium text-lg">{countByStatus("delayed")}</h3>
              <p className="text-sm text-muted-foreground">Atrasadas</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Filtros:</span>
              
              <select 
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value as ProcessArea | "all")}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">Todas as áreas</option>
                <option value="manufacturing">Produção</option>
                <option value="quality">Qualidade</option>
                <option value="management">Gestão</option>
                <option value="hr">Recursos Humanos</option>
                <option value="sales">Vendas</option>
                <option value="supply_chain">Cadeia de Suprimentos</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredActions.length} {filteredActions.length === 1 ? 'ação encontrada' : 'ações encontradas'}
            </div>
          </div>
          
          {/* Actions Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando ações...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-destructive">
              <AlertCircle className="mr-2" />
              <p>Erro ao carregar as ações</p>
            </div>
          ) : (
            <ActionTable 
              actions={filteredActions} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}
        </div>
      </main>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedAction && (
          <ActionForm 
            action={selectedAction}
            onClose={() => setIsEditDialogOpen(false)}
            afterSubmit={() => queryClient.invalidateQueries({ queryKey: ["actions"] })}
          />
        )}
      </Dialog>
      
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedAction && (
          <ActionDetails 
            action={selectedAction}
            onClose={() => setIsViewDialogOpen(false)}
            onEdit={() => {
              setIsViewDialogOpen(false);
              setIsEditDialogOpen(true);
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ActionSchedule;
