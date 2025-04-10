
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReunioesTabSelectProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ReunioesTabSelect({ activeTab, setActiveTab }: ReunioesTabSelectProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
        <TabsTrigger value="realizadas">Realizadas</TabsTrigger>
        <TabsTrigger value="minhas">Minhas Atividades</TabsTrigger>
        <TabsTrigger value="acoes">Plano de Ação</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
