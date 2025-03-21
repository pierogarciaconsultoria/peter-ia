
import { useState } from "react";
import { Action5W2H } from "@/types/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ActionTableProps = {
  actions: Action5W2H[];
  onEdit: (action: Action5W2H) => void;
  onDelete: (action: Action5W2H) => void;
  onView: (action: Action5W2H) => void;
};

export function ActionTable({ actions, onEdit, onDelete, onView }: ActionTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "delayed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planned": return "Planejada";
      case "in_progress": return "Em Andamento";
      case "completed": return "Concluída";
      case "delayed": return "Atrasada";
      case "cancelled": return "Cancelada";
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low": return "Baixa";
      case "medium": return "Média";
      case "high": return "Alta";
      case "critical": return "Crítica";
      default: return priority;
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case "planning": return "Planejamento";
      case "audit": return "Auditoria";
      case "non_conformity": return "Não Conformidade";
      case "corrective_action": return "Ação Corretiva";
      case "critical_analysis": return "Análise Crítica";
      case "customer_satisfaction": return "Pesquisa de Satisfação";
      case "supplier_evaluation": return "Avaliação de Fornecedor";
      case "customer_complaint": return "Reclamação de Cliente";
      case "other": return "Outro";
      default: return source;
    }
  };

  const getProcessText = (process: string) => {
    switch (process) {
      case "manufacturing": return "Produção";
      case "quality": return "Qualidade";
      case "management": return "Gestão";
      case "hr": return "Recursos Humanos";
      case "sales": return "Vendas";
      case "supply_chain": return "Cadeia de Suprimentos";
      case "other": return "Outro";
      default: return process;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (value: number | null, currency: string = "BRL") => {
    if (value === null) return "";
    
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    });
    
    return formatter.format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Data Limite</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Processo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Nenhuma ação encontrada
              </TableCell>
            </TableRow>
          ) : (
            actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.title}</TableCell>
                <TableCell>{action.responsible}</TableCell>
                <TableCell>{formatDate(action.due_date)}</TableCell>
                <TableCell>{getSourceText(action.source)}</TableCell>
                <TableCell>{getProcessText(action.process_area)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(action.status)}`}>
                    {getStatusText(action.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(action.priority)}`}>
                    {getPriorityText(action.priority)}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(action.how_much, action.currency)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(action)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(action)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(action)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
