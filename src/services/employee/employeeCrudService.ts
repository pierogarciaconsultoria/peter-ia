
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "./types";
import { toast } from "@/components/ui/use-toast";

/**
 * Creates a new employee
 */
export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee | null> {
  try {
    if (!employeeData.name || !employeeData.email || !employeeData.position || !employeeData.department) {
      toast({
        title: "Invalid employee data",
        description: "Required fields are missing",
        variant: "destructive",
      });
      return null;
    }

    // Set a default company_id if not provided
    const employeeWithCompany = {
      ...employeeData,
      company_id: employeeData.company_id || '00000000-0000-0000-0000-000000000000' // Using a standard UUID
    };
    
    const { data, error } = await supabase
      .from("employees")
      .insert(employeeWithCompany)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Failed to create employee",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Employee created",
      description: `Successfully created employee: ${employeeData.name}`,
      variant: "default",
    });
    
    return data as Employee;
  } catch (error) {
    console.error("Error creating employee:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not create the employee",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Updates an existing employee
 */
export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
  try {
    if (!id) {
      toast({
        title: "Invalid request",
        description: "Employee ID is required for updates",
        variant: "destructive",
      });
      return null;
    }

    // Ensure we don't try to update the company_id if it's not provided
    const updateData = { ...employeeData };
    
    if (!updateData.company_id) {
      delete updateData.company_id;
    }
    
    const { data, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating employee with id ${id}:`, error);
      toast({
        title: "Failed to update employee",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Employee updated",
      description: `Successfully updated employee information`,
      variant: "default",
    });
    
    return data as Employee;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not update the employee",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Deletes an employee
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    if (!id) {
      toast({
        title: "Invalid request",
        description: "Employee ID is required for deletion",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      toast({
        title: "Failed to delete employee",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Employee deleted",
      description: "Employee has been successfully removed",
      variant: "default",
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not delete the employee",
      variant: "destructive",
    });
    return false;
  }
}
