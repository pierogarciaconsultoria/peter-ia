
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Clipboard, FileCheck2 } from "lucide-react";
import { Audit } from "@/services/auditService";

interface AuditStatusCardsProps {
  plannedAudits: Audit[];
  inProgressAudits: Audit[];
  completedAudits: Audit[];
}

export const AuditStatusCards = ({ plannedAudits, inProgressAudits, completedAudits }: AuditStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <CalendarClock className="mr-2 h-4 w-4 text-blue-500" />
              Auditorias Planejadas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{plannedAudits.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <Clipboard className="mr-2 h-4 w-4 text-amber-500" />
              Auditorias em Andamento
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{inProgressAudits.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <FileCheck2 className="mr-2 h-4 w-4 text-green-500" />
              Auditorias Concluídas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedAudits.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};
