
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PersonnelRequest } from "./types";

interface RequestTableProps {
  requests: PersonnelRequest[];
}

export function RequestTable({ requests }: RequestTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hiring":
        return "Contratação";
      case "transfer":
        return "Transferência";
      case "termination":
        return "Desligamento";
      case "salary_change":
        return "Alteração Salarial";
      default:
        return type;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Solicitante</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{getTypeLabel(request.type)}</TableCell>
            <TableCell>{request.department}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{request.position}</span>
                {request.position_id && (
                  <span className="text-xs text-muted-foreground">
                    Cód: {request.position_id}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>{request.requester}</TableCell>
            <TableCell>{request.requestDate}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
