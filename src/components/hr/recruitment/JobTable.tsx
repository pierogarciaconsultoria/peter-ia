
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Link, Globe } from "lucide-react";

interface JobTableProps {
  jobs: {
    id: string;
    title: string;
    department: string;
    applications: number;
    positions: number;
    openDate: string;
    status: string;
    stage: string;
    isPublic: boolean;
  }[];
  getStatusBadge: (status: string) => JSX.Element;
  onCopyLink: (jobId: string) => void;
}

export function JobTable({ jobs, getStatusBadge, onCopyLink }: JobTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vaga</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Candidaturas</TableHead>
            <TableHead>Posições</TableHead>
            <TableHead>Data de Abertura</TableHead>
            <TableHead>Etapa Atual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Divulgação</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.applications}</TableCell>
              <TableCell>{job.positions}</TableCell>
              <TableCell>{new Date(job.openDate).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{getStatusBadge(job.stage)}</TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell>
                {job.isPublic ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Globe className="mr-1 h-3 w-3" />
                    Pública
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                    Interna
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {job.isPublic && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onCopyLink(job.id)}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
