
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ReunioesAgendadas } from "./tabs/ReunioesAgendadas";
import { ReunioesRealizadas } from "./tabs/ReunioesRealizadas";
import { MinhasAtividades } from "./tabs/MinhasAtividades";
import { ReunioesPlanosAcao } from "./tabs/ReunioesPlanosAcao";

interface ReunioesTabContentProps {
  activeTab: string;
}

export function ReunioesTabContent({ activeTab }: ReunioesTabContentProps) {
  return (
    <div className="mt-4">
      <Tabs defaultValue={activeTab} value={activeTab}>
        <TabsContent value="agendadas">
          <ReunioesAgendadas />
        </TabsContent>
        
        <TabsContent value="realizadas">
          <ReunioesRealizadas />
        </TabsContent>
        
        <TabsContent value="minhas">
          <MinhasAtividades />
        </TabsContent>
        
        <TabsContent value="acoes">
          <ReunioesPlanosAcao />
        </TabsContent>
      </Tabs>
    </div>
  );
}
