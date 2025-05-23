
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchTrainings as getTrainings } from "@/services/training";
import { Training } from "@/types/training";
import { supabase } from "@/integrations/supabase/client";
import { TrainingStats } from "./TrainingStats";
import { TrainingTable } from "./TrainingTable";
import { TrainingFilterBar } from "./TrainingFilterBar";
import { NewTrainingDialog } from "./NewTrainingDialog";
import { useToast } from "@/components/ui/use-toast";

export function TrainingDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch trainings
      const trainingData = await getTrainings();
      setTrainings(trainingData);
      setFilteredTrainings(trainingData);

      // Fetch departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('name')
        .order('name');
      
      if (deptData) {
        const deptNames = deptData.map(dept => dept.name);
        setDepartments(deptNames);
      }

      // Fetch employees
      const { data: employeeData } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active');
      
      if (employeeData) {
        setEmployees(employeeData);
      }

      // Fetch procedures
      const { data: procedureData } = await supabase
        .from('iso_documents')
        .select('id, title, document_type, associated_requirement')
        .eq('document_type', 'procedure');
      
      if (procedureData) {
        setProcedures(procedureData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de treinamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingCreated = async (newTraining: any) => {
    toast({
      title: "Sucesso",
      description: "Treinamento criado com sucesso",
    });
    await fetchData();
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...trainings];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(training => 
        training.title.toLowerCase().includes(query) || 
        (training.description && training.description.toLowerCase().includes(query))
      );
    }

    // Filter by department
    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(training => training.department === filters.department);
    }

    // Filter by employee
    if (filters.employeeId && filters.employeeId !== 'all') {
      filtered = filtered.filter(training => {
        if (!training.participants) return false;
        return training.participants.some((p: any) => p.id === filters.employeeId);
      });
    }

    // Filter by procedure
    if (filters.procedure && filters.procedure !== 'all') {
      filtered = filtered.filter(training => 
        training.procedure_id === filters.procedure || 
        training.title.includes(filters.procedure)
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(training => 
        new Date(training.training_date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(training => 
        new Date(training.training_date) <= new Date(filters.endDate)
      );
    }

    setFilteredTrainings(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Controle de Treinamentos</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Treinamento
        </Button>
      </div>

      <TrainingFilterBar 
        departments={departments}
        employees={employees}
        procedures={procedures}
        onFilterChange={handleFilterChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingStats trainings={trainings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingTable 
            trainings={filteredTrainings} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>

      <NewTrainingDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        departments={departments}
        employees={employees}
        procedures={procedures}
        onTrainingCreated={handleTrainingCreated}
      />
    </div>
  );
}
