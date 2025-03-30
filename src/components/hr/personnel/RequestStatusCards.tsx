
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonnelRequest } from "./types";

interface RequestStatusCardsProps {
  requests: PersonnelRequest[];
}

export function RequestStatusCards({ requests }: RequestStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{requests.length}</div>
          <p className="text-xs text-muted-foreground">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Contratações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requests.filter(r => r.type === "hiring").length}
          </div>
          <p className="text-xs text-muted-foreground">
            Pendentes: {requests.filter(r => r.type === "hiring" && r.status === "pending").length}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transferências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requests.filter(r => r.type === "transfer").length}
          </div>
          <p className="text-xs text-muted-foreground">
            Pendentes: {requests.filter(r => r.type === "transfer" && r.status === "pending").length}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Desligamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {requests.filter(r => r.type === "termination").length}
          </div>
          <p className="text-xs text-muted-foreground">
            Pendentes: {requests.filter(r => r.type === "termination" && r.status === "pending").length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
