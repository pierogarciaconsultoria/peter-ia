
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { Risk } from "@/services/riskService";

interface RiskTableProps {
  risks: Risk[];
  onDelete: (id: string) => void;
  onEdit: (risk: Risk) => void;
  onView: (risk: Risk) => void;
}

export function RiskTable({ risks, onDelete, onEdit, onView }: RiskTableProps) {
  // Helper function to get risk level color
  const getRiskLevelColor = (level: number) => {
    if (level >= 15) return "text-red-500";
    if (level >= 8) return "text-orange-500";
    if (level >= 3) return "text-yellow-500";
    return "text-green-500";
  };

  // Helper function to get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "mitigated":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "mitigated":
        return "Mitigado";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Processo</TableHead>
            <TableHead className="text-center">Probabilidade</TableHead>
            <TableHead className="text-center">Impacto</TableHead>
            <TableHead className="text-center">Nível</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhum risco encontrado.
              </TableCell>
            </TableRow>
          ) : (
            risks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.title}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{risk.process}</TableCell>
                <TableCell className="text-center">{risk.probability}</TableCell>
                <TableCell className="text-center">{risk.impact}</TableCell>
                <TableCell className="text-center">
                  <span className={`font-bold ${getRiskLevelColor(risk.risk_level || 0)}`}>
                    {risk.risk_level}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(risk.status)}`}>
                    {formatStatus(risk.status)}
                  </span>
                </TableCell>
                <TableCell>{risk.responsible}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(risk)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(risk)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDelete(risk.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
