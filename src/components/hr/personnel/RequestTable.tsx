
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { PersonnelRequest } from "./types";

interface RequestTableProps {
  requests: PersonnelRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function RequestTable({ requests, onApprove, onReject }: RequestTableProps) {
  // Get status badge based on request status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      case "manager_approval":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Aguardando gestor</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pendente</Badge>;
    }
  };
  
  // Sort requests to show newest first and ones awaiting approval at the top
  const sortedRequests = [...requests].sort((a, b) => {
    // Sort by status first (manager_approval first, then pending, etc.)
    if (a.status === "manager_approval" && b.status !== "manager_approval") return -1;
    if (a.status !== "manager_approval" && b.status === "manager_approval") return 1;
    // Then sort by date (newest first)
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Requisitante</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRequests.length > 0 ? (
            sortedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.position}</TableCell>
                <TableCell>{request.requester}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  {request.status === "manager_approval" && (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => onApprove(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => onReject(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                      </Button>
                    </div>
                  )}
                  {request.status === "approved" && (
                    <div className="text-sm text-green-600">
                      Aprovado em {request.approval_date}
                      {request.approved_by && <span> por {request.approved_by}</span>}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhuma solicitação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
