
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, Plus, ChevronLeft } from "lucide-react";
import { DocumentItem } from "@/components/DocumentItem";
import { TaskItem } from "@/components/TaskItem";
import { getDocumentsForRequirement, getTasksForRequirement } from "@/utils/isoTemplates";

interface ChildRequirementDialogProps {
  requirement: ISORequirement;
  onClose: () => void;
}

export function ChildRequirementDialog({ requirement, onClose }: ChildRequirementDialogProps) {
  return (
    <>
      <DialogHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 left-2 h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          <ChevronLeft size={16} />
        </Button>
        <div className="flex items-center gap-2 mb-1 mt-4">
          <span className="text-sm font-medium text-primary px-3 py-0.5 bg-primary/10 rounded-full">
            {requirement.number}
          </span>
        </div>
        <DialogTitle className="text-2xl">
          {requirement.title}
        </DialogTitle>
        <DialogDescription className="text-base mt-2">
          {requirement.description}
        </DialogDescription>
      </DialogHeader>
      
      <ProgressIndicator 
        status={requirement.status} 
        progress={requirement.progress} 
        className="mt-4"
      />
      
      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4 space-y-4">
          <div className="rounded-lg border border-border/40 p-4">
            <h4 className="text-sm font-medium mb-2">Orientação para Implementação</h4>
            <p className="text-sm text-muted-foreground">
              {requirement.recommendedActions || "Para atender a este requisito, você precisa estabelecer processos e documentação que demonstrem como sua organização aborda este aspecto específico da norma ISO 9001:2015."}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 p-4">
            <h4 className="text-sm font-medium mb-2">Evidências Necessárias</h4>
            <p className="text-sm text-muted-foreground">
              {requirement.evidence || "Documente sua abordagem, crie procedimentos, mantenha registros e garanta que eles estejam acessíveis às partes interessadas relevantes."}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 p-4">
            <h4 className="text-sm font-medium mb-2">Atualização de Status</h4>
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1">Definir Em Andamento</Button>
              <Button variant="outline" size="sm" className="flex-1">Marcar como Concluído</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="documents">
          {getDocumentsForRequirement(requirement.number).length > 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-4">
              {getDocumentsForRequirement(requirement.number).map((document) => (
                <DocumentItem key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                <FileText size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Não há documentos associados a este requisito ainda.
              </p>
              <Button className="mt-4">
                <Plus size={16} className="mr-2" />
                Adicionar Documento
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="tasks">
          {getTasksForRequirement(requirement.number).length > 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-4">
              {getTasksForRequirement(requirement.number).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                <ClipboardList size={28} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Nenhuma tarefa encontrada</h3>
              <p className="text-muted-foreground mt-2">
                Não há tarefas associadas a este requisito ainda.
              </p>
              <Button className="mt-4">
                <Plus size={16} className="mr-2" />
                Adicionar Tarefa
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
