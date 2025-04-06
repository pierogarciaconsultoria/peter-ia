
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Clipboard, FileCheck2, ListFilter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Audit } from "@/services/auditService";
import { AuditCard } from "./AuditCard";

interface AuditTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  plannedAudits: Audit[];
  inProgressAudits: Audit[];
  completedAudits: Audit[];
  audits: Audit[];
  isLoading: boolean;
}

export const AuditTabs = ({
  activeTab,
  setActiveTab,
  plannedAudits,
  inProgressAudits,
  completedAudits,
  audits,
  isLoading,
}: AuditTabsProps) => {
  // Helper function to render content based on whether there are audits or not
  const renderContent = (auditsArray: Audit[], emptyMessage: string): ReactNode => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Carregando auditorias...</p>
          </CardContent>
        </Card>
      );
    }

    if (auditsArray.length > 0) {
      return (
        <div className="grid gap-4">
          {auditsArray.map((audit) => (
            <AuditCard key={audit.id} audit={audit} />
          ))}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center">
            <CalendarClock className="mr-2 h-4 w-4" />
            Planejadas
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="flex items-center">
            <Clipboard className="mr-2 h-4 w-4" />
            Em Andamento
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <FileCheck2 className="mr-2 h-4 w-4" />
            Concluídas
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center">
            <ListFilter className="mr-2 h-4 w-4" />
            Todas
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="upcoming">
        {renderContent(plannedAudits, "Nenhuma auditoria planejada.")}
      </TabsContent>

      <TabsContent value="in_progress">
        {renderContent(inProgressAudits, "Nenhuma auditoria em andamento.")}
      </TabsContent>

      <TabsContent value="completed">
        {renderContent(completedAudits, "Nenhuma auditoria concluída.")}
      </TabsContent>

      <TabsContent value="all">
        {renderContent(audits, "Nenhuma auditoria cadastrada.")}
      </TabsContent>
    </Tabs>
  );
};
