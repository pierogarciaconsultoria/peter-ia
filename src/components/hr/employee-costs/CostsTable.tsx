
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CostItem } from "./types";
import { formatCurrency, getMonthName } from "./utils/formatters";

interface CostsTableProps {
  costs: CostItem[];
}

export function CostsTable({ costs }: CostsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Mês/Ano</TableHead>
          <TableHead>Salário Base</TableHead>
          <TableHead>Benefícios</TableHead>
          <TableHead>Encargos</TableHead>
          <TableHead>Outros</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>H. Trabalhadas</TableHead>
          <TableHead className="text-right">Custo/Hora</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {costs.length > 0 ? (
          costs.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">{cost.employeeName}</TableCell>
              <TableCell>{getMonthName(cost.month)} {cost.year}</TableCell>
              <TableCell>{formatCurrency(cost.baseSalary)}</TableCell>
              <TableCell>{formatCurrency(cost.benefits)}</TableCell>
              <TableCell>{formatCurrency(cost.taxes)}</TableCell>
              <TableCell>{formatCurrency(cost.otherCosts)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(cost.totalCost)}</TableCell>
              <TableCell>{cost.workingHours}h</TableCell>
              <TableCell className="text-right">{formatCurrency(cost.hourCost)}/h</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
              Nenhum registro encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
