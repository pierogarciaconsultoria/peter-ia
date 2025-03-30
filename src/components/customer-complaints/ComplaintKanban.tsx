
import { useState } from "react";
import { CustomerComplaint, updateComplaintDetailedStatus } from "@/services/customerComplaintService";
import { ComplaintKanbanColumn } from "./ComplaintKanbanColumn";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanSquare, List } from "lucide-react";

interface ComplaintKanbanProps {
  complaints: CustomerComplaint[];
  onStatusChange: (updatedComplaint: CustomerComplaint) => void;
}

export function ComplaintKanban({ complaints, onStatusChange }: ComplaintKanbanProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");

  const handleStatusChange = async (complaint: CustomerComplaint, newStatus: CustomerComplaint['detailed_status']) => {
    try {
      setIsMoving(true);
      const updatedComplaint = await updateComplaintDetailedStatus(complaint.id, newStatus);
      toast.success("Status atualizado com sucesso");
      onStatusChange(updatedComplaint);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast.error("Falha ao atualizar o status");
    } finally {
      setIsMoving(false);
    }
  };

  // Group complaints by detailed status
  const novaReclamacao = complaints.filter(c => !c.detailed_status || c.detailed_status === 'nova_reclamacao');
  const analiseReclamacao = complaints.filter(c => c.detailed_status === 'analise_reclamacao');
  const identificacaoCausa = complaints.filter(c => c.detailed_status === 'identificacao_causa');
  const acao = complaints.filter(c => c.detailed_status === 'acao');
  const acompanhamento = complaints.filter(c => c.detailed_status === 'acompanhamento');
  const conclusao = complaints.filter(c => c.detailed_status === 'conclusao');

  return (
    <div className="space-y-4">
      <Tabs defaultValue="kanban" onValueChange={(v) => setViewMode(v as "list" | "kanban")} className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="kanban" className="flex items-center">
              <KanbanSquare className="h-4 w-4 mr-1" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <List className="h-4 w-4 mr-1" />
              Lista
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban">
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="grid grid-cols-6 gap-4 min-w-[1200px]">
              <ComplaintKanbanColumn
                title="Nova Reclamação"
                count={novaReclamacao.length}
                complaints={novaReclamacao}
                status="nova_reclamacao"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
              <ComplaintKanbanColumn
                title="Análise da Reclamação"
                count={analiseReclamacao.length}
                complaints={analiseReclamacao}
                status="analise_reclamacao"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
              <ComplaintKanbanColumn
                title="Identificação da Causa"
                count={identificacaoCausa.length}
                complaints={identificacaoCausa}
                status="identificacao_causa"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
              <ComplaintKanbanColumn
                title="Ação"
                count={acao.length}
                complaints={acao}
                status="acao"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
              <ComplaintKanbanColumn
                title="Acompanhamento"
                count={acompanhamento.length}
                complaints={acompanhamento}
                status="acompanhamento"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
              <ComplaintKanbanColumn
                title="Conclusão"
                count={conclusao.length}
                complaints={conclusao}
                status="conclusao"
                onStatusChange={handleStatusChange}
                isDisabled={isMoving}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="p-4">
            {viewMode === "list" && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Visualização em lista ainda não implementada.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
