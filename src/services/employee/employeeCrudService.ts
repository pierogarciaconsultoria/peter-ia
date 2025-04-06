
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "./types";

/**
 * Creates a new employee
 */
export async function createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee | null> {
  try {
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
      return null;
    }
    
    return data as Employee;
  } catch (error) {
    console.error("Error creating employee:", error);
    return null;
  }
}

/**
 * Updates an existing employee
 */
export async function updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
  try {
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
      return null;
    }
    
    return data as Employee;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    return null;
  }
}

/**
 * Deletes an employee
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    return false;
  }
}
