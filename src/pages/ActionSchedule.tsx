
import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the useActionSchedule hook
import { useActionSchedule } from "@/hooks/useActionSchedule";

// Import components for action plan
import { ActionHeader } from "@/components/actions/ActionHeader";
import { ActionStatusCards } from "@/components/actions/ActionStatusCards";
import { ActionTable } from "@/components/actions/ActionTable";
import { ActionForm } from "@/components/actions/ActionForm";
import { ActionViewToggle } from "@/components/actions/ActionViewToggle";
import { ActionFilters } from "@/components/actions/ActionFilters";
import { ActionKanban } from "@/components/actions/kanban/ActionKanban";
import { ActionGantt } from "@/components/actions/gantt/ActionGantt";
import { ActionsByResponsible } from "@/components/actions/responsible/ActionsByResponsible";

export default function ActionSchedule() {
  // Use the hook to get all the actions data and functions
  const { 
    actions,
    filteredActions,
    isLoading,
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
    selectedAction,
    statusCounts,
    invalidateActions,
    viewFormat,
    setViewFormat,
    handleExportToPDF
  } = useActionSchedule();
  
  const totalCount = actions.length;
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Plano de Ação</h1>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <ActionForm 
              onClose={() => setIsAddDialogOpen(false)}
              afterSubmit={invalidateActions}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <ActionHeader 
        onAddAction={() => setIsAddDialogOpen(true)}
      />
      
      <ActionStatusCards 
        totalCount={totalCount}
        counts={statusCounts}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <ActionFilters 
          processFilter={processFilter}
          sourceFilter={sourceFilter}
          onProcessFilterChange={setProcessFilter}
          onSourceFilterChange={setSourceFilter}
          filteredCount={filteredActions.length}
        />
        <ActionViewToggle 
          viewFormat={viewFormat} 
          onViewFormatChange={setViewFormat}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="open">Em Aberto</TabsTrigger>
          <TabsTrigger value="progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="delayed">Atrasadas</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {viewFormat === "table" && (
            <ActionTable 
              actions={filteredActions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "kanban" && (
            <ActionKanban 
              actions={filteredActions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "gantt" && (
            <ActionGantt 
              actions={filteredActions}
              onAction={handleView}
            />
          )}
          {viewFormat === "responsible" && (
            <ActionsByResponsible 
              actions={filteredActions}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="open" className="pt-4">
          {viewFormat === "table" && (
            <ActionTable 
              actions={filteredActions.filter(a => a.status === 'planned')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "kanban" && (
            <ActionKanban 
              actions={filteredActions.filter(a => a.status === 'planned')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "gantt" && (
            <ActionGantt 
              actions={filteredActions.filter(a => a.status === 'planned')}
              onAction={handleView}
            />
          )}
          {viewFormat === "responsible" && (
            <ActionsByResponsible 
              actions={filteredActions.filter(a => a.status === 'planned')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="pt-4">
          {viewFormat === "table" && (
            <ActionTable 
              actions={filteredActions.filter(a => a.status === 'in_progress')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "kanban" && (
            <ActionKanban 
              actions={filteredActions.filter(a => a.status === 'in_progress')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "gantt" && (
            <ActionGantt 
              actions={filteredActions.filter(a => a.status === 'in_progress')}
              onAction={handleView}
            />
          )}
          {viewFormat === "responsible" && (
            <ActionsByResponsible 
              actions={filteredActions.filter(a => a.status === 'in_progress')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="delayed" className="pt-4">
          {viewFormat === "table" && (
            <ActionTable 
              actions={filteredActions.filter(a => a.status === 'delayed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "kanban" && (
            <ActionKanban 
              actions={filteredActions.filter(a => a.status === 'delayed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "gantt" && (
            <ActionGantt 
              actions={filteredActions.filter(a => a.status === 'delayed')}
              onAction={handleView}
            />
          )}
          {viewFormat === "responsible" && (
            <ActionsByResponsible 
              actions={filteredActions.filter(a => a.status === 'delayed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          {viewFormat === "table" && (
            <ActionTable 
              actions={filteredActions.filter(a => a.status === 'completed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "kanban" && (
            <ActionKanban 
              actions={filteredActions.filter(a => a.status === 'completed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewFormat === "gantt" && (
            <ActionGantt 
              actions={filteredActions.filter(a => a.status === 'completed')}
              onAction={handleView}
            />
          )}
          {viewFormat === "responsible" && (
            <ActionsByResponsible 
              actions={filteredActions.filter(a => a.status === 'completed')}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
