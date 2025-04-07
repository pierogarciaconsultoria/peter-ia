
import { ISORequirement } from "@/utils/isoRequirements";
import { getTasksForRequirement } from "@/utils/isoTemplates";
import { requirementToRouteMap } from "@/utils/requirementRouteMapping";
import { Button } from "@/components/ui/button";
import { Navigation, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { TaskItem } from "@/components/TaskItem";

interface DetailsTabProps {
  requirement: ISORequirement;
}

export function DetailsTab({ requirement }: DetailsTabProps) {
  return (
    <div className="mt-4 space-y-4">
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
    </div>
  );
}

interface ApplicationTabProps {
  requirement: ISORequirement;
}

export function ApplicationTab({ requirement }: ApplicationTabProps) {
  const mappedRoute = requirementToRouteMap[requirement.number];
  
  return (
    <>
      {mappedRoute ? (
        <div className="bg-muted/30 p-6 rounded-lg border border-border/40 mt-4">
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
        </div>
      ) : (
        <div className="p-8 text-center mt-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <Navigation size={28} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma aplicação vinculada</h3>
          <p className="text-muted-foreground mt-2">
            Este requisito ainda não possui uma aplicação específica no sistema.
          </p>
        </div>
      )}
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
