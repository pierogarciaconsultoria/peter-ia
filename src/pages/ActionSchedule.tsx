
import { useState } from "react";
import { ClipboardList, Plus, ListFilter, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importar componentes de plano de ação
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Plano de Ação</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <ActionForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <ActionHeader />
      
      <ActionStatusCards />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <ActionFilters />
        <ActionViewToggle activeView={viewMode} onViewChange={setViewMode} />
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
          {viewMode === "table" && <ActionTable />}
          {viewMode === "kanban" && <ActionKanban />}
          {viewMode === "gantt" && <ActionGantt />}
          {viewMode === "responsible" && <ActionsByResponsible />}
        </TabsContent>
        
        <TabsContent value="open" className="pt-4">
          {viewMode === "table" && <ActionTable status="open" />}
          {viewMode === "kanban" && <ActionKanban status="open" />}
          {viewMode === "gantt" && <ActionGantt status="open" />}
          {viewMode === "responsible" && <ActionsByResponsible status="open" />}
        </TabsContent>
        
        <TabsContent value="progress" className="pt-4">
          {viewMode === "table" && <ActionTable status="progress" />}
          {viewMode === "kanban" && <ActionKanban status="progress" />}
          {viewMode === "gantt" && <ActionGantt status="progress" />}
          {viewMode === "responsible" && <ActionsByResponsible status="progress" />}
        </TabsContent>
        
        <TabsContent value="delayed" className="pt-4">
          {viewMode === "table" && <ActionTable status="delayed" />}
          {viewMode === "kanban" && <ActionKanban status="delayed" />}
          {viewMode === "gantt" && <ActionGantt status="delayed" />}
          {viewMode === "responsible" && <ActionsByResponsible status="delayed" />}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          {viewMode === "table" && <ActionTable status="completed" />}
          {viewMode === "kanban" && <ActionKanban status="completed" />}
          {viewMode === "gantt" && <ActionGantt status="completed" />}
          {viewMode === "responsible" && <ActionsByResponsible status="completed" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
