
import { useState } from "react";
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
import { JobPosition } from "../types";
import { Eye, Check, RefreshCw, Share2 } from "lucide-react";

interface JobPositionTableProps {
  jobPositions: JobPosition[];
  onViewDetails: (jobPosition: JobPosition) => void;
  onApprove: (jobPosition: JobPosition) => void;
  onRevise: (jobPosition: JobPosition) => void;
  onDistribute: (jobPosition: JobPosition) => void;
}

export function JobPositionTable({
  jobPositions,
  onViewDetails,
  onApprove,
  onRevise,
  onDistribute,
}: JobPositionTableProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "in_review":
        return <Badge className="bg-amber-500">Em Revisão</Badge>;
      case "distributed":
        return <Badge className="bg-blue-500">Distribuído</Badge>;
      default:
        return <Badge variant="outline">Rascunho</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código da DC</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Revisão</TableHead>
            <TableHead>Data de Aprovação</TableHead>
            <TableHead>Aprovador</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobPositions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="font-medium">{position.code}</TableCell>
              <TableCell>{position.title}</TableCell>
              <TableCell>{position.department}</TableCell>
              <TableCell>{position.revision}</TableCell>
              <TableCell>{position.approval_date || "-"}</TableCell>
              <TableCell>{position.approver || "-"}</TableCell>
              <TableCell>{getStatusBadge(position.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(position)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onApprove(position)}
                    disabled={position.status === "approved"}
                    className="text-green-600"
                    title="Aprovar"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRevise(position)}
                    disabled={position.status === "in_review"}
                    className="text-amber-600"
                    title="Revisão"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDistribute(position)}
                    disabled={position.status === "distributed" || position.status !== "approved"}
                    className="text-blue-600"
                    title="Distribuir"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
