
import { ISORequirement } from "@/utils/isoRequirements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Plus, Navigation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "@/components/DocumentItem";
import { TaskItem } from "@/components/TaskItem";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import { getDocumentsForRequirement, getTasksForRequirement } from "@/utils/isoTemplates";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { requirementToRouteMap } from "@/utils/requirementRouteMapping";

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

interface ApplicationTabProps {
  requirement: ISORequirement;
}

export function ApplicationTab({ requirement }: ApplicationTabProps) {
  const mappedRoute = requirementToRouteMap[requirement.number];
  
  return (
    <div className="mt-4">
      {mappedRoute ? (
        <div className="bg-muted/30 p-6 rounded-lg border border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
              Aplicação Relacionada
            </span>
          </div>
          
          <h3 className="text-xl font-medium mb-2">{mappedRoute.title}</h3>
          <p className="text-muted-foreground mb-4">
            {mappedRoute.description}
          </p>
          
          <Button className="mt-2" asChild>
            <a href={mappedRoute.route}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Acessar Aplicação
            </a>
          </Button>
          
          <div className="mt-8 border-t pt-4">
            <h4 className="text-lg font-medium mb-2">Como esta aplicação atende ao requisito {requirement.number}</h4>
            <p className="text-muted-foreground">
              Este módulo do sistema foi projetado para ajudar sua organização a implementar e manter
              o requisito {requirement.number} da ISO 9001:2015 de forma prática e eficiente, substituindo 
              a necessidade de documentação física excessiva por um fluxo de trabalho digital e rastreável.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <Navigation size={28} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma aplicação vinculada</h3>
          <p className="text-muted-foreground mt-2">
            Este requisito ainda não possui uma aplicação específica no sistema.
          </p>
        </div>
      )}
    </div>
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
