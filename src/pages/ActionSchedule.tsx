
import { Dialog } from "@/components/ui/dialog";
import { AlertCircle, Download } from "lucide-react";
import { ActionTable } from "@/components/actions/ActionTable";
import { ActionForm } from "@/components/actions/ActionForm";
import { ActionDetails } from "@/components/actions/ActionDetails";
import { ActionHeader } from "@/components/actions/ActionHeader";
import { ActionStatusCards } from "@/components/actions/ActionStatusCards";
import { ActionFilters } from "@/components/actions/ActionFilters";
import { ActionViewToggle } from "@/components/actions/ActionViewToggle";
import { ActionKanban } from "@/components/actions/kanban/ActionKanban";
import { ActionGantt } from "@/components/actions/gantt/ActionGantt";
import { ActionsByResponsible } from "@/components/actions/responsible/ActionsByResponsible";
import { Button } from "@/components/ui/button";
import { useActionSchedule } from "@/hooks/useActionSchedule";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

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
    invalidateActions,
    viewFormat,
    setViewFormat,
    handleExportToPDF
  } = useActionSchedule();

  return (
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-6 space-y-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <ActionHeader onAddAction={() => setIsAddDialogOpen(true)} title="Plano de Ação" />
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
          
          {/* Filters and View Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <ActionFilters
              processFilter={processFilter}
              onProcessFilterChange={setProcessFilter}
              sourceFilter={sourceFilter}
              onSourceFilterChange={setSourceFilter}
              filteredCount={filteredActions.length}
            />
            
            <div className="flex items-center gap-4">
              <ActionViewToggle
                viewFormat={viewFormat}
                onViewFormatChange={setViewFormat}
              />
              
              <Button variant="outline" onClick={handleExportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
          
          {/* Actions Content Based on View Format */}
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
            <>
              {viewFormat === 'table' && (
                <ActionTable 
                  actions={filteredActions} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              )}
              
              {viewFormat === 'kanban' && (
                <ActionKanban 
                  actions={filteredActions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              )}
              
              {viewFormat === 'gantt' && (
                <ActionGantt 
                  actions={filteredActions}
                  onAction={handleView}
                />
              )}
              
              {viewFormat === 'responsible' && (
                <ActionsByResponsible 
                  actions={filteredActions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              )}
            </>
          )}
        </div>
        
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
    </AuthenticationRequired>
  );
};

export default ActionSchedule;
