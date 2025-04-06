
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "@/components/DocumentItem";
import { TaskItem } from "@/components/TaskItem";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import { getDocumentsForRequirement, getTasksForRequirement } from "@/utils/isoTemplates";
import { ProgressIndicator } from "@/components/ProgressIndicator";

interface RequirementChildCardProps {
  child: ISORequirement;
  onClick: (child: ISORequirement) => void;
}

function RequirementChildCard({ child, onClick }: RequirementChildCardProps) {
  return (
    <Card 
      key={child.id}
      className="cursor-pointer card-hover overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm"
      onClick={() => onClick(child)}
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
  );
}

interface RequirementsTabProps {
  requirement: ISORequirement;
  onChildRequirementClick: (childRequirement: ISORequirement) => void;
}

export function RequirementsTab({ requirement, onChildRequirementClick }: RequirementsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {requirement.children?.map((child) => (
        <RequirementChildCard 
          key={child.id} 
          child={child} 
          onClick={onChildRequirementClick} 
        />
      ))}
    </div>
  );
}

interface DocumentsTabProps {
  requirement: ISORequirement;
}

export function DocumentsTab({ requirement }: DocumentsTabProps) {
  const documents = getDocumentsForRequirement(requirement.number);
  
  return (
    <>
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 mt-4 mb-6">
          {documents.map((document) => (
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
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Modelo de Formulário para Requisito {requirement.number}</h3>
        <DocumentTemplate requirement={requirement} />
      </div>
    </>
  );
}

interface TasksTabProps {
  requirement: ISORequirement;
}

export function TasksTab({ requirement }: TasksTabProps) {
  const tasks = getTasksForRequirement(requirement.number);
  
  return (
    <>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 mt-4">
          {tasks.map((task) => (
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
    </>
  );
}
