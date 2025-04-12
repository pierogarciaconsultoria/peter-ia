
import { useState } from "react";
import { ListChecks, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importar componentes de auditoria
import { AuditHeader } from "@/components/audit/AuditHeader";
import { AuditStatusCards } from "@/components/audit/AuditStatusCards";
import { AuditTabs } from "@/components/audit/AuditTabs";
import { AuditCard } from "@/components/audit/AuditCard";
import { NextAuditCard } from "@/components/audit/NextAuditCard";

export default function AuditSchedule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ListChecks className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Agenda de Auditoria</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Auditoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Agendar Nova Auditoria</h2>
            {/* Formulário de agendamento seria implementado aqui */}
          </DialogContent>
        </Dialog>
      </div>
      
      <AuditHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AuditStatusCards />
        </div>
        <div>
          <NextAuditCard />
        </div>
      </div>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList>
          <TabsTrigger value="schedule">Calendário</TabsTrigger>
          <TabsTrigger value="planned">Planejadas</TabsTrigger>
          <TabsTrigger value="execution">Em Execução</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="canceled">Canceladas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="pt-4">
          <div className="p-6 bg-card rounded-lg border h-96 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-muted-foreground/40" />
          </div>
        </TabsContent>
        
        <TabsContent value="planned" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AuditCard 
              title="Auditoria Interna - Produção" 
              date="15/05/2025"
              auditor="João Silva"
              status="planned"
            />
            <AuditCard 
              title="Auditoria Interna - Administrativo" 
              date="22/05/2025"
              auditor="Maria Oliveira"
              status="planned"
            />
            <AuditCard 
              title="Auditoria Interna - Compras" 
              date="29/05/2025"
              auditor="Carlos Santos"
              status="planned"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="execution" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AuditCard 
              title="Auditoria Interna - Vendas" 
              date="10/05/2025 - 12/05/2025"
              auditor="Ana Pereira"
              status="execution"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AuditCard 
              title="Auditoria Interna - Logística" 
              date="01/04/2025 - 03/04/2025"
              auditor="Roberto Ferreira"
              status="completed"
              findings={2}
            />
            <AuditCard 
              title="Auditoria Interna - RH" 
              date="15/03/2025 - 17/03/2025"
              auditor="Juliana Costa"
              status="completed"
              findings={0}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="canceled" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AuditCard 
              title="Auditoria Interna - TI" 
              date="05/02/2025"
              auditor="Paulo Mendes"
              status="canceled"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
