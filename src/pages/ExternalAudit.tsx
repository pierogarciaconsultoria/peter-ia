
import { useState } from "react";
import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importar componentes de auditoria externa
import { ExternalAuditHeader } from "@/components/external-audit/ExternalAuditHeader";
import { ExternalAuditStatusCards } from "@/components/external-audit/ExternalAuditStatusCards";
import { ExternalAuditTable } from "@/components/external-audit/ExternalAuditTable";
import { ExternalAuditDialog } from "@/components/external-audit/ExternalAuditDialog";
import { ExternalAuditReportDialog } from "@/components/external-audit/ExternalAuditReportDialog";

export default function ExternalAudit() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Auditoria Externa</h1>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Gerar Relatório</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <ExternalAuditReportDialog onClose={() => setIsReportDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Auditoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <ExternalAuditDialog onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <ExternalAuditHeader />
      
      <ExternalAuditStatusCards />
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="findings">Não Conformidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-4">
          <ExternalAuditTable status="upcoming" />
        </TabsContent>
        
        <TabsContent value="progress" className="pt-4">
          <ExternalAuditTable status="progress" />
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <ExternalAuditTable status="completed" />
        </TabsContent>
        
        <TabsContent value="findings" className="pt-4">
          <ExternalAuditTable status="findings" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
