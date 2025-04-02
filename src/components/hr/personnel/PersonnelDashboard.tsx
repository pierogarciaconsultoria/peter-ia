
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { RequestFormDialog } from "./RequestFormDialog";
import { RequestHeader } from "./RequestHeader";
import { RequestStatusCards } from "./RequestStatusCards";
import { RequestTable } from "./RequestTable";
import { usePersonnelData } from "./hooks/usePersonnelData";
import { useRequestActions } from "./hooks/useRequestActions";
import { PersonnelRequestHandler } from "./PersonnelRequestHandler";

export function PersonnelDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { requests, setRequests, jobPositions, employees, isLoading, handleRefresh } = usePersonnelData();
  const { handleApproval, handleRejection, handleCancellation } = useRequestActions(requests, setRequests);
  const { handleSubmit } = PersonnelRequestHandler({ 
    onAddRequest: () => setIsDialogOpen(true), 
    requests, 
    setRequests, 
    employees, 
    jobPositions 
  });
  
  return (
    <div className="space-y-6">
      <RequestHeader 
        onAddRequest={() => setIsDialogOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <RequestStatusCards requests={requests} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>
            Gerenciamento de requisições para o setor de Recursos Humanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestTable 
            requests={requests} 
            onApprove={handleApproval}
            onReject={handleRejection}
          />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>
      
      {/* New Request Dialog */}
      <RequestFormDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleSubmit}
        jobPositions={jobPositions}
      />
    </div>
  );
}
