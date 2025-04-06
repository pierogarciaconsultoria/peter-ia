
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "./types";
import { mockEmployees } from "./mockData";
import { toast } from "@/components/ui/use-toast";

/**
 * Gets all employees
 */
export async function getEmployees(): Promise<Employee[]> {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase.from("employees").select("*");
    
    if (error) {
      console.error("Error fetching employees from Supabase:", error);
      toast({
        title: "Failed to fetch employees",
        description: error.message,
        variant: "destructive",
      });
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
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch employee data. Using mock data instead.",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    return mockEmployees;
  }
}

/**
 * Gets an employee by id
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    if (!id) {
      toast({
        title: "Invalid request",
        description: "Employee ID is required",
        variant: "destructive",
      });
      return null;
    }

    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching employee with id ${id} from Supabase:`, error);
      toast({
        title: "Failed to fetch employee",
        description: error.message,
        variant: "destructive",
      });
      // Fallback to mock data
      const employee = mockEmployees.find(emp => emp.id === id);
      return employee || null;
    }
    
    if (data) {
      return data as Employee;
    }
    
    // If no data returned but no error, search in mock data
    const employee = mockEmployees.find(emp => emp.id === id);
    if (!employee) {
      toast({
        title: "Employee not found",
        description: `No employee found with ID: ${id}`,
        variant: "destructive",
      });
    }
    return employee || null;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch employee data",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    const employee = mockEmployees.find(emp => emp.id === id);
    return employee || null;
  }
}
