
import { ISORequirement } from "@/utils/isoRequirements";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Plus } from "lucide-react";
import { DocumentItem } from "@/components/DocumentItem";
import { TaskItem } from "@/components/TaskItem";
import { getDocumentsForRequirement, getTasksForRequirement } from "@/utils/isoTemplates";
import { DocumentTemplate } from "@/components/DocumentTemplate";

interface RequirementDialogProps {
  requirement: ISORequirement;
  onChildRequirementClick: (childRequirement: ISORequirement) => void;
}

export function RequirementDialog({ requirement, onChildRequirementClick }: RequirementDialogProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
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
      
      <Tabs defaultValue="requirements" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements">Requisitos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>
        <TabsContent value="requirements" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {requirement.children?.map((child, index) => (
              <Card 
                key={child.id}
                className="cursor-pointer card-hover overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm"
                onClick={() => onChildRequirementClick(child)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                      {child.number}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{child.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressIndicator 
                    status={child.status} 
                    progress={child.progress} 
                  />
                </CardContent>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {child.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="documents">
          {getDocumentsForRequirement(requirement.number).length > 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-4 mb-6">
              {getDocumentsForRequirement(requirement.number).map((document) => (
                <DocumentItem key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center mb-6">
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
          
          {/* Document template section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Modelo de Formulário para Requisito {requirement.number}</h3>
            <DocumentTemplate requirement={requirement} />
          </div>
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
