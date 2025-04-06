
import { supabase } from "@/integrations/supabase/client";
import { Employee, mockEmployees } from "./types";

/**
 * Gets all employees
 */
export async function getEmployees(): Promise<Employee[]> {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase.from("employees").select("*");
    
    if (error) {
      console.error("Error fetching employees from Supabase:", error);
      // Fallback to mock data
      return mockEmployees;
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, return mock data
    return mockEmployees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    // Fallback to mock data in case of exception
    return mockEmployees;
  }
}

/**
 * Gets an employee by id
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(`Error fetching employee with id ${id} from Supabase:`, error);
      // Fallback to mock data
      const employee = mockEmployees.find(emp => emp.id === id);
      return employee || null;
    }
    
    if (data) {
      return data as Employee;
    }
    
    // If no data returned but no error, search in mock data
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    // Fallback to mock data in case of exception
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  }
}
