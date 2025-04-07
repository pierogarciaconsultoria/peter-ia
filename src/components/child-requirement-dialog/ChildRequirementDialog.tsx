
import { ISORequirement } from "@/utils/isoRequirements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ChildRequirementHeader } from "./ChildRequirementHeader";
import { DetailsTab, ApplicationTab, TasksTab } from "./ChildRequirementTabContent";

interface ChildRequirementDialogProps {
  requirement: ISORequirement;
  onClose: () => void;
}

export function ChildRequirementDialog({ requirement, onClose }: ChildRequirementDialogProps) {
  return (
    <>
      <ChildRequirementHeader requirement={requirement} onClose={onClose} />
      
      <ProgressIndicator 
        status={requirement.status} 
        progress={requirement.progress} 
        className="mt-4"
      />
      
      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="application">Aplicação</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab requirement={requirement} />
        </TabsContent>
        <TabsContent value="application">
          <ApplicationTab requirement={requirement} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab requirement={requirement} />
        </TabsContent>
      </Tabs>
    </>
  );
}
