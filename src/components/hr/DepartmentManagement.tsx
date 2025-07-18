import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Department, useDepartments } from "@/hooks/useDepartments";
import { DepartmentFormDialog } from "./departments/DepartmentFormDialog";
import { DeleteConfirmDialog } from "./departments/DeleteConfirmDialog";
import { DepartmentHeader } from "./departments/DepartmentHeader";
import { DepartmentListCard } from "./departments/DepartmentListCard";
import { TemplateDepartmentsDialog } from "./departments/TemplateDepartmentsDialog";

export function DepartmentManagement() {
  const { toast } = useToast();
  const { departments, isLoading, refetch } = useDepartments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, department')
        .eq('status', 'active');
        
      if (!error && data) {
        setEmployees(data);
      }
    };
    
    fetchEmployees();
  }, []);

  const handleOpenForm = (department?: Department) => {
    setSelectedDepartment(department || null);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenTemplatesDialog = () => {
    setIsTemplatesDialogOpen(true);
  };

  const handleSaveDepartment = async (departmentData: Partial<Department>) => {
    try {
      let newDepartment: Department;

      if (selectedDepartment) {
        const { data, error } = await supabase
          .from("departments")
          .update({
            name: departmentData.name,
            description: departmentData.description,
            sector: departmentData.sector,
            responsible_employee_id: departmentData.responsible_employee_id,
            approved_headcount: departmentData.approved_headcount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedDepartment.id)
          .select("*")
          .single();

        if (error) throw error;
        
        newDepartment = {
          ...data,
          current_headcount: selectedDepartment.current_headcount
        };

        toast({
          title: "Departamento atualizado",
          description: "O departamento foi atualizado com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from("departments")
          .insert({
            name: departmentData.name,
            description: departmentData.description,
            sector: departmentData.sector,
            responsible_employee_id: departmentData.responsible_employee_id,
            approved_headcount: departmentData.approved_headcount,
          })
          .select("*")
          .single();

        if (error) throw error;
        
        newDepartment = {
          ...data,
          current_headcount: 0
        };

        toast({
          title: "Departamento criado",
          description: "O novo departamento foi criado com sucesso.",
        });
      }

      refetch();
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

      refetch();

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

  const handleAddTemplateDepartment = async (department: { name: string; description: string; sector: string }) => {
    try {
      const { error } = await supabase
        .from("departments")
        .insert({
          name: department.name,
          description: department.description,
          sector: department.sector,
        });

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o departamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <DepartmentHeader 
        onAddDepartment={() => handleOpenForm()} 
        onShowTemplates={handleOpenTemplatesDialog}
      />

      <DepartmentListCard
        departments={departments}
        isLoading={isLoading}
        onEditDepartment={handleOpenForm}
        onDeleteDepartment={handleOpenDeleteDialog}
        onAddDepartment={() => handleOpenForm()}
        onShowTemplates={handleOpenTemplatesDialog}
      />

      <DepartmentFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveDepartment}
        department={selectedDepartment}
        employees={employees}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteDepartment}
        title="Excluir departamento"
        description={`Tem certeza que deseja excluir o departamento "${selectedDepartment?.name}"? Esta ação não pode ser desfeita.`}
      />

      <TemplateDepartmentsDialog
        isOpen={isTemplatesDialogOpen}
        onOpenChange={setIsTemplatesDialogOpen}
        onAddDepartment={handleAddTemplateDepartment}
      />
    </div>
  );
}
