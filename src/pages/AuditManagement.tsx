
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, List, FileText } from "lucide-react";
import AuditSchedule from "./AuditSchedule";
import AuditPlan from "./AuditPlan";
import ExternalAudit from "./ExternalAudit";

export default function AuditManagement() {
  const [tab, setTab] = useState("programa");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold">Auditoria (ISO 9001:2015 - 9.2)</h1>
            <p className="text-muted-foreground">
              Gerencie todo o ciclo de auditoria: programa, plano e relatório
            </p>
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="programa" className="flex items-center"><List className="mr-2 h-5 w-5" />Programa de Auditoria</TabsTrigger>
              <TabsTrigger value="plano" className="flex items-center"><Book className="mr-2 h-5 w-5" />Plano de Auditoria</TabsTrigger>
              <TabsTrigger value="relatorio" className="flex items-center"><FileText className="mr-2 h-5 w-5" />Relatório de Auditoria</TabsTrigger>
            </TabsList>
            <TabsContent value="programa" className="mt-6"><AuditSchedule /></TabsContent>
            <TabsContent value="plano" className="mt-6"><AuditPlan /></TabsContent>
            <TabsContent value="relatorio" className="mt-6"><ExternalAudit /></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
