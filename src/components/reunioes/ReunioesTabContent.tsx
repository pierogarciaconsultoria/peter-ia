
import { TabsContent } from "@/components/ui/tabs";
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
      <TabsContent value="agendadas" className={activeTab === "agendadas" ? "block" : "hidden"}>
        <ReunioesAgendadas />
      </TabsContent>
      
      <TabsContent value="realizadas" className={activeTab === "realizadas" ? "block" : "hidden"}>
        <ReunioesRealizadas />
      </TabsContent>
      
      <TabsContent value="minhas" className={activeTab === "minhas" ? "block" : "hidden"}>
        <MinhasAtividades />
      </TabsContent>
      
      <TabsContent value="acoes" className={activeTab === "acoes" ? "block" : "hidden"}>
        <ReunioesPlanosAcao />
      </TabsContent>
    </div>
  );
}
