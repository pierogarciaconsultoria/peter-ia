
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import { ExportarRelatorioReuniao } from "./ExportarRelatorioReuniao";
import { useVisualizarAta } from "./hooks/useVisualizarAta";
import { ResumoTab } from "./ata/ResumoTab";
import { ParticipantesTab } from "./ata/ParticipantesTab";
import { AcoesTab } from "./ata/AcoesTab";
import { VisualizarAtaProps } from "./types";
import { formatarData } from "./utils/formatters";

export function VisualizarAta({ 
  reuniaoId, 
  isOpen, 
  onClose
}: VisualizarAtaProps) {
  const {
    activeTab,
    setActiveTab,
    loading,
    reuniao,
    participantes,
    acoes
  } = useVisualizarAta(reuniaoId, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {loading ? "Carregando..." : `Ata de Reunião: ${reuniao?.titulo}`}
          </DialogTitle>
          <DialogDescription>
            {loading ? "" : reuniao?.data ? formatarData(reuniao.data) : ''}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="mt-2 text-sm text-muted-foreground">Carregando ata...</span>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="participantes">Participantes</TabsTrigger>
                <TabsTrigger value="acoes">Plano de Ação</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1 overflow-auto p-4">
                <TabsContent value="resumo">
                  <ResumoTab 
                    reuniao={reuniao} 
                    participantes={participantes} 
                    acoes={acoes} 
                  />
                </TabsContent>
                
                <TabsContent value="participantes">
                  <ParticipantesTab participantes={participantes} />
                </TabsContent>
                
                <TabsContent value="acoes">
                  <AcoesTab acoes={acoes} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
            
            <DialogFooter className="mt-4 gap-2">
              <ExportarRelatorioReuniao reuniaoId={reuniaoId} />
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
