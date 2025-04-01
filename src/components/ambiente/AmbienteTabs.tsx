
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CalendarDays, ListTodo } from 'lucide-react';

interface AmbienteTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AmbienteTabs({ activeTab, onTabChange }: AmbienteTabsProps) {
  return (
    <Tabs defaultValue="rooms" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="rooms">
          <Building2 className="mr-2 h-4 w-4" />
          Ambientes
        </TabsTrigger>
        <TabsTrigger value="list">
          <ListTodo className="mr-2 h-4 w-4" />
          Reservas
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarDays className="mr-2 h-4 w-4" />
          Calendário
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
