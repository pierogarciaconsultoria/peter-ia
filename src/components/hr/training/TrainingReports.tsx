
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Users, Building, Briefcase } from "lucide-react";
import { TrainingMatrixData } from "@/types/trainingMatrix";

interface TrainingReportsProps {
  companyId: string;
  matrixData: TrainingMatrixData[];
}

export function TrainingReports({ companyId, matrixData }: TrainingReportsProps) {
  const [reportType, setReportType] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const reportTypes = [
    { value: "employee", label: "Por Funcionário", icon: Users, description: "Lista de treinamentos pendentes/concluídos por funcionário" },
    { value: "position", label: "Por Cargo", icon: Briefcase, description: "Requisitos completos de capacitação por cargo" },
    { value: "department", label: "Por Setor", icon: Building, description: "Consolidado de todos os cargos do departamento" },
    { value: "compliance", label: "Compliance Geral", icon: FileText, description: "Relatório geral de conformidade de treinamentos" }
  ];

  const generateReport = (type: string, format: string) => {
    console.log(`Generating ${type} report in ${format} format`);
    // Aqui seria implementada a geração dos relatórios
  };

  const getComplianceData = () => {
    const totalEmployees = new Set(
      matrixData.flatMap(item => item.compliance.map(c => c.employee_id))
    ).size;
    
    const totalRequirements = matrixData.reduce((sum, item) => sum + item.compliance.length, 0);
    const completed = matrixData.reduce((sum, item) => 
      sum + item.compliance.filter(c => c.status === 'completed').length, 0
    );
    
    return {
      totalEmployees,
      totalRequirements,
      completed,
      completionRate: totalRequirements > 0 ? (completed / totalRequirements) * 100 : 0
    };
  };

  const complianceData = getComplianceData();

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div 
                  key={type.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    reportType === type.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportType(type.value)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-6 w-6 mt-1" />
                    <div>
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {reportType && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtro adicional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Apenas Pendentes</SelectItem>
                    <SelectItem value="completed">Apenas Concluídos</SelectItem>
                    <SelectItem value="overdue">Apenas Atrasados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => generateReport(reportType, 'pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" onClick={() => generateReport(reportType, 'excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{complianceData.totalEmployees}</p>
              <p className="text-sm text-muted-foreground">Funcionários</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{matrixData.length}</p>
              <p className="text-sm text-muted-foreground">Cargos com Requisitos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{complianceData.totalRequirements}</p>
              <p className="text-sm text-muted-foreground">Requisitos Totais</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{complianceData.completionRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Preview dos Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matrixData.slice(0, 5).map((item) => (
              <div key={item.jobPosition.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.jobPosition.title}</p>
                    <p className="text-sm text-muted-foreground">{item.jobPosition.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.requirements.length} requisitos
                    </Badge>
                    <Badge variant="secondary">
                      {new Set(item.compliance.map(c => c.employee_id)).size} funcionários
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
