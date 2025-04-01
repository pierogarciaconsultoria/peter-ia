
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  AlertTriangle,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { OccurrenceWithEmployee } from "@/services/occurrenceService";

interface OccurrenceStatsProps {
  occurrences: OccurrenceWithEmployee[];
}

export function OccurrenceStats({ occurrences }: OccurrenceStatsProps) {
  const pendingCount = occurrences.filter(o => o.status === "pending").length;
  const resolvedCount = occurrences.filter(o => o.status === "resolved").length;
  const inProgressCount = occurrences.filter(o => o.status === "in_progress").length;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Total de Ocorrências
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occurrences.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pendentes
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Em Andamento
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center">
              <UserRound className="h-4 w-4 mr-2" />
              Resolvidas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
