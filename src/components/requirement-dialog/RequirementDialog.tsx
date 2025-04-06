
import { ISORequirement } from "@/utils/isoRequirements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { getRequirementDeadline } from "@/utils/isoDeadlines";
import { RequirementHeader } from "./RequirementHeader";
import { RequirementDeadlineInfo } from "./RequirementDeadlineInfo";
import { 
  RequirementsTab, 
  ApplicationTab, 
  TasksTab 
} from "./RequirementTabContent";

interface RequirementDialogProps {
  requirement: ISORequirement;
  onChildRequirementClick: (childRequirement: ISORequirement) => void;
}

export function RequirementDialog({ requirement, onChildRequirementClick }: RequirementDialogProps) {
  const deadline = getRequirementDeadline(requirement.number);
  
  return (
    <>
      <RequirementHeader requirement={requirement} />
      
      <RequirementDeadlineInfo deadline={deadline} />
      
      <ProgressIndicator 
        status={requirement.status} 
        progress={requirement.progress} 
        className="mt-4"
      />
      
      <Tabs defaultValue="requirements" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements">Requisitos</TabsTrigger>
          <TabsTrigger value="application">Aplicação</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements" className="mt-4">
          <RequirementsTab 
            requirement={requirement} 
            onChildRequirementClick={onChildRequirementClick}
          />
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
