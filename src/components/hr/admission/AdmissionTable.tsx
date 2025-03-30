
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Link as LinkIcon, ListChecks } from "lucide-react";
import { AdmissionProcess } from "./types";
import { getStatusBadge } from "./StatusBadge";

interface AdmissionTableProps {
  admissionProcesses: AdmissionProcess[];
  onSelectProcess: (id: string | null) => void;
  selectedProcess: string | null;
}

export function AdmissionTable({ 
  admissionProcesses, 
  onSelectProcess, 
  selectedProcess 
}: AdmissionTableProps) {
  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead className="w-[150px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admissionProcesses.map((process) => (
            <TableRow key={process.id}>
              <TableCell className="font-medium">{process.name}</TableCell>
              <TableCell>{process.position}</TableCell>
              <TableCell>{process.department}</TableCell>
              <TableCell>{new Date(process.startDate).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{getStatusBadge(process.status)}</TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${process.completion}%` }}>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{process.completion}%</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onSelectProcess(selectedProcess === process.id ? null : process.id)}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ListChecks className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FileText className="h-4 w-4" />
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
