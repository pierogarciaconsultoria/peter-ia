
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Users, BookOpen, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrainingMatrixData, JobPositionTrainingRequirement } from "@/types/trainingMatrix";

interface TrainingMatrixTableProps {
  data: TrainingMatrixData[];
  isLoading: boolean;
  onEditRequirement: (requirement: JobPositionTrainingRequirement) => void;
}

export function TrainingMatrixTable({ data, isLoading, onEditRequirement }: TrainingMatrixTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (jobPositionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(jobPositionId)) {
      newExpanded.delete(jobPositionId);
    } else {
      newExpanded.add(jobPositionId);
    }
    setExpandedRows(newExpanded);
  };

  const getComplianceRate = (matrixItem: TrainingMatrixData) => {
    if (matrixItem.compliance.length === 0) return 0;
    const completed = matrixItem.compliance.filter(c => c.status === 'completed').length;
    return (completed / matrixItem.compliance.length) * 100;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, label: "Concluído", color: "bg-green-500" },
      in_progress: { variant: "secondary" as const, label: "Em Andamento", color: "bg-blue-500" },
      pending: { variant: "outline" as const, label: "Pendente", color: "bg-yellow-500" },
      overdue: { variant: "destructive" as const, label: "Atrasado", color: "bg-red-500" },
      exempt: { variant: "secondary" as const, label: "Isento", color: "bg-gray-500" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum dado na matriz</h3>
        <p className="text-muted-foreground">
          Configure requisitos de treinamento para os cargos para visualizar a matriz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Requisitos</TableHead>
            <TableHead>Funcionários</TableHead>
            <TableHead>Taxa de Compliance</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((matrixItem) => {
            const isExpanded = expandedRows.has(matrixItem.jobPosition.id);
            const complianceRate = getComplianceRate(matrixItem);
            const employeeCount = new Set(matrixItem.compliance.map(c => c.employee_id)).size;

            return (
              <>
                <TableRow 
                  key={matrixItem.jobPosition.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleRow(matrixItem.jobPosition.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? "−" : "+"}
                      </Button>
                      {matrixItem.jobPosition.title}
                    </div>
                  </TableCell>
                  <TableCell>{matrixItem.jobPosition.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {matrixItem.requirements.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {employeeCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={complianceRate} className="w-20" />
                      <span className="text-sm">{complianceRate.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Exportar Relatório</DropdownMenuItem>
                        <DropdownMenuItem>Gerenciar Requisitos</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="bg-muted/30 p-4 space-y-4">
                        {/* Requisitos de Treinamento */}
                        <div>
                          <h4 className="font-medium mb-2">Requisitos de Treinamento</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {matrixItem.requirements.map((req) => (
                              <div key={req.id} className="border rounded p-3 bg-background">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">
                                      {req.training?.title || req.procedure?.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={req.is_mandatory ? "default" : "secondary"} className="text-xs">
                                        {req.is_mandatory ? "Obrigatório" : "Opcional"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {req.completion_deadline_days} dias
                                      </span>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditRequirement(req);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status dos Funcionários */}
                        {matrixItem.compliance.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Status dos Funcionários</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {matrixItem.compliance.slice(0, 6).map((compliance) => (
                                <div key={compliance.id} className="border rounded p-2 bg-background">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium">{compliance.employee?.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {compliance.requirement?.training?.title || compliance.requirement?.procedure?.title}
                                      </p>
                                    </div>
                                    {getStatusBadge(compliance.status)}
                                  </div>
                                </div>
                              ))}
                              {matrixItem.compliance.length > 6 && (
                                <div className="border rounded p-2 bg-background flex items-center justify-center">
                                  <p className="text-sm text-muted-foreground">
                                    +{matrixItem.compliance.length - 6} mais
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
