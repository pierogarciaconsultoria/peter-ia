
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, FileText } from "lucide-react";
import { OccurrenceWithEmployee } from "@/services/occurrenceService";
import { OccurrenceBadges } from "./OccurrenceBadges";

interface OccurrenceTableProps {
  occurrences: OccurrenceWithEmployee[];
  isLoading: boolean;
}

export function OccurrenceTable({ occurrences, isLoading }: OccurrenceTableProps) {
  const { getTypeBadge, getStatusBadge } = OccurrenceBadges();
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Reportado Por</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Carregando ocorrências...
              </TableCell>
            </TableRow>
          ) : occurrences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Nenhuma ocorrência encontrada
              </TableCell>
            </TableRow>
          ) : (
            occurrences.map((occurrence) => (
              <TableRow key={occurrence.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={occurrence.employee.avatar_url || undefined} />
                      <AvatarFallback>{occurrence.employee.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{occurrence.employee.name}</span>
                      <span className="text-xs text-muted-foreground">{occurrence.employee.department}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(occurrence.type)}</TableCell>
                <TableCell className="font-medium">{occurrence.title}</TableCell>
                <TableCell>{new Date(occurrence.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{occurrence.reported_by}</TableCell>
                <TableCell>{getStatusBadge(occurrence.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
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
