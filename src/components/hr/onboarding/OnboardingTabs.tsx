
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingTabContent } from "./OnboardingTabContent";
import { OnboardingProcess } from "./types";

interface OnboardingTabsProps {
  onboardingProcesses: OnboardingProcess[];
}

export function OnboardingTabs({ onboardingProcesses }: OnboardingTabsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="active">Em Andamento</TabsTrigger>
        <TabsTrigger value="completed">Concluídos</TabsTrigger>
      </TabsList>
      
      <OnboardingTabContent 
        tabValue="all" 
        onboardingProcesses={onboardingProcesses} 
      />
      
      <OnboardingTabContent 
        tabValue="active" 
        onboardingProcesses={onboardingProcesses.filter(p => p.status === "em_andamento")} 
        simpleView={true}
      />
      
      <OnboardingTabContent 
        tabValue="completed" 
        onboardingProcesses={onboardingProcesses.filter(p => p.status === "concluido")} 
        simpleView={true}
      />
    </Tabs>
  );
}
