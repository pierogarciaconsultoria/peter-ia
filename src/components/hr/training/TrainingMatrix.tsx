
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Download, Target, Users } from "lucide-react";
import { TrainingMatrixService } from "@/services/trainingMatrixService";
import { TrainingMatrixData, ComplianceStats } from "@/types/trainingMatrix";
import { useToast } from "@/components/ui/use-toast";
import { TrainingMatrixTable } from "./TrainingMatrixTable";
import { TrainingMatrixFilters } from "./TrainingMatrixFilters";

export function TrainingMatrix() {
  const [matrixData, setMatrixData] = useState<TrainingMatrixData[]>([]);
  const [filteredData, setFilteredData] = useState<TrainingMatrixData[]>([]);
  const [complianceStats, setComplianceStats] = useState<ComplianceStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  // Mock company ID - em produção, vem do contexto
  const companyId = 'default-company-id';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [matrixData, filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [matrixResult, statsResult] = await Promise.all([
        TrainingMatrixService.getTrainingMatrix(companyId),
        TrainingMatrixService.getComplianceStats(companyId)
      ]);

      setMatrixData(matrixResult);
      setComplianceStats(statsResult);

      // Extract unique departments and job positions for filters
      const uniqueDepartments = Array.from(
        new Set(matrixResult.map(item => item.jobPosition.department))
      ).map(dept => ({ id: dept, name: dept }));
      
      const uniqueJobPositions = matrixResult.map(item => ({
        id: item.jobPosition.id,
        title: item.jobPosition.title
      }));

      setDepartments(uniqueDepartments);
      setJobPositions(uniqueJobPositions);

    } catch (error) {
      console.error("Error loading training matrix data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da matriz de treinamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...matrixData];

    if (filters.department) {
      filtered = filtered.filter(item => 
        item.jobPosition.department === filters.department
      );
    }

    if (filters.jobPosition) {
      filtered = filtered.filter(item => 
        item.jobPosition.title === filters.jobPosition
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => 
        item.compliance.some(comp => comp.status === filters.status)
      );
    }

    setFilteredData(filtered);
  };

  const handleExport = () => {
    console.log("Exporting training matrix data...");
    toast({
      title: "Exportando",
      description: "Relatório da matriz de treinamentos sendo gerado...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Matriz de Treinamentos por Cargo</h2>
          <p className="text-muted-foreground">
            Visualize os requisitos de treinamento organizados por cargo e monitore o compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Matriz
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Requisitos</p>
                <p className="text-2xl font-bold">{complianceStats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">{complianceStats.completed}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {complianceStats.completionRate.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{complianceStats.inProgress}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{complianceStats.overdue}</p>
              </div>
              <Badge variant="destructive">
                Atenção
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TrainingMatrixFilters 
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
        jobPositions={jobPositions}
        employees={employees}
      />

      {/* Training Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Treinamentos por Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingMatrixTable 
            data={filteredData.length > 0 ? filteredData : matrixData}
            isLoading={isLoading}
            onEditRequirement={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}
