
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Building } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DepartmentFormDialog } from "./departments/DepartmentFormDialog";
import { DeleteConfirmDialog } from "./departments/DeleteConfirmDialog";

export interface Department {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  responsible_employee_id: string | null;
  responsible_name?: string;
  employee_count?: number;
}

export function DepartmentManagement() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the database
      const { data: departmentsData, error } = await supabase
        .from("departments")
        .select("*");

      if (error) {
        throw error;
      }

      // For demonstration, we'll add some mock data for responsible name and employee count
      const enrichedDepartments = departmentsData.map((dept: any) => ({
        ...dept,
        responsible_name: dept.responsible_employee_id ? "Carlos Silva" : undefined,
        employee_count: Math.floor(Math.random() * 20) + 1 // Mock employee count
      }));

      setDepartments(enrichedDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Erro ao carregar departamentos",
        description: "Não foi possível carregar os departamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenForm = (department?: Department) => {
    setSelectedDepartment(department || null);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveDepartment = async (departmentData: Partial<Department>) => {
    try {
      let newDepartment: Department;

      if (selectedDepartment) {
        // Update existing department
        const { data, error } = await supabase
          .from("departments")
          .update({
            name: departmentData.name,
            description: departmentData.description,
            sector: departmentData.sector,
            responsible_employee_id: departmentData.responsible_employee_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedDepartment.id)
          .select("*")
          .single();

        if (error) throw error;
        newDepartment = {
          ...data,
          responsible_name: data.responsible_employee_id ? "Carlos Silva" : undefined,
          employee_count: selectedDepartment.employee_count
        };

        toast({
          title: "Departamento atualizado",
          description: "O departamento foi atualizado com sucesso.",
        });
      } else {
        // Create new department
        const { data, error } = await supabase
          .from("departments")
          .insert({
            name: departmentData.name,
            description: departmentData.description,
            sector: departmentData.sector,
            responsible_employee_id: departmentData.responsible_employee_id,
          })
          .select("*")
          .single();

        if (error) throw error;
        newDepartment = {
          ...data,
          responsible_name: data.responsible_employee_id ? "Carlos Silva" : undefined,
          employee_count: 0
        };

        toast({
          title: "Departamento criado",
          description: "O novo departamento foi criado com sucesso.",
        });
      }

      // Update the departments list
      if (selectedDepartment) {
        setDepartments(departments.map(dept =>
          dept.id === selectedDepartment.id ? newDepartment : dept
        ));
      } else {
        setDepartments([...departments, newDepartment]);
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o departamento.",
        variant: "destructive",
      });
    }

    setIsFormOpen(false);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", selectedDepartment.id);

      if (error) throw error;

      // Update the departments list
      setDepartments(departments.filter(dept => dept.id !== selectedDepartment.id));

      toast({
        title: "Departamento excluído",
        description: "O departamento foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o departamento.",
        variant: "destructive",
      });
    }

    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os departamentos da sua empresa
          </p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Lista de Departamentos
          </CardTitle>
          <CardDescription>
            Visualize e gerencie todos os departamentos da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Carregando departamentos...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Nenhum departamento cadastrado</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Começe criando um novo departamento para sua empresa
              </p>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Departamento
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Qtd. Funcionários</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div className="font-medium">{department.name}</div>
                        {department.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {department.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {department.sector ? (
                          <Badge variant="outline">{department.sector}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Não definido</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {department.responsible_name || (
                          <span className="text-muted-foreground text-sm">Não definido</span>
                        )}
                      </TableCell>
                      <TableCell>{department.employee_count}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm(department)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleOpenDeleteDialog(department)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DepartmentFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveDepartment}
        department={selectedDepartment}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteDepartment}
        title="Excluir departamento"
        description={`Tem certeza que deseja excluir o departamento "${selectedDepartment?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
