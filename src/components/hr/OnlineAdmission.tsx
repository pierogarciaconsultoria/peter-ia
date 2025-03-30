
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { NewEmployeeDialog } from "./NewEmployeeDialog";
import { UserPlus } from "lucide-react";
import { 
  AdmissionProcess, 
  DocumentLinkGenerator, 
  StatisticsCards, 
  AdmissionTable, 
  PendingAdmissions, 
  CompletedAdmissions,
  mockAdmissionProcesses
} from "./admission";

export function OnlineAdmission() {
  const [admissionProcesses] = useState<AdmissionProcess[]>(mockAdmissionProcesses);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admissão Online</h2>
        <NewEmployeeDialog triggerButton={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Nova Admissão
          </Button>
        } />
      </div>
      
      <StatisticsCards admissionProcesses={admissionProcesses} />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <AdmissionTable 
            admissionProcesses={admissionProcesses}
            onSelectProcess={setSelectedProcess}
            selectedProcess={selectedProcess}
          />
          
          {/* Link Generator para o processo selecionado */}
          {selectedProcess && (
            <div className="mt-4">
              {(() => {
                const process = admissionProcesses.find(p => p.id === selectedProcess);
                if (!process) return null;
                return (
                  <DocumentLinkGenerator 
                    employeeId={process.id} 
                    employeeName={process.name}
                    email={process.email}
                    phone={process.phone}
                  />
                );
              })()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admissões Pendentes</CardTitle>
              <CardDescription>Processos que ainda precisam de documentação ou aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingAdmissions 
                admissionProcesses={admissionProcesses}
                onSelectProcess={(id) => setSelectedProcess(id)}
              />
            </CardContent>
          </Card>
          
          {/* Link Generator para o processo selecionado na aba Pendentes */}
          {selectedProcess && (
            <div className="mt-4">
              {(() => {
                const process = admissionProcesses.find(p => p.id === selectedProcess);
                if (!process) return null;
                return (
                  <DocumentLinkGenerator 
                    employeeId={process.id} 
                    employeeName={process.name}
                    email={process.email}
                    phone={process.phone}
                  />
                );
              })()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Admissões Concluídas</CardTitle>
              <CardDescription>Processos com contrato assinado e documentação completa</CardDescription>
            </CardHeader>
            <CardContent>
              <CompletedAdmissions admissionProcesses={admissionProcesses} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
