
import { Dialog } from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AlertCircle } from "lucide-react";
import { ActionTable } from "@/components/actions/ActionTable";
import { ActionForm } from "@/components/actions/ActionForm";
import { ActionDetails } from "@/components/actions/ActionDetails";
import { ActionHeader } from "@/components/actions/ActionHeader";
import { ActionStatusCards } from "@/components/actions/ActionStatusCards";
import { ActionFilters } from "@/components/actions/ActionFilters";
import { useActionSchedule } from "@/hooks/useActionSchedule";

const ActionSchedule = () => {
  const {
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
    invalidateActions
  } = useActionSchedule();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <ActionHeader onAddAction={() => setIsAddDialogOpen(true)} />
            <ActionForm 
              onClose={() => setIsAddDialogOpen(false)} 
              afterSubmit={invalidateActions}
            />
          </Dialog>
          
          {/* Status Cards */}
          <ActionStatusCards
            totalCount={filteredActions.length}
            counts={statusCounts}
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
          
          {/* Filters */}
          <ActionFilters
            processFilter={processFilter}
            onProcessFilterChange={setProcessFilter}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            filteredCount={filteredActions.length}
          />
          
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
      
      <Footer />
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedAction && (
          <ActionForm 
            action={selectedAction}
            onClose={() => setIsEditDialogOpen(false)}
            afterSubmit={invalidateActions}
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
