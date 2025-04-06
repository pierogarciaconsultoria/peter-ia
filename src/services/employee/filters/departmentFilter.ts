
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types";
import { mockEmployees } from "../mockData";
import { toast } from "@/components/ui/use-toast";

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  try {
    if (!department) {
      toast({
        title: "Invalid request",
        description: "Department is required",
        variant: "destructive",
      });
      return [];
    }

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("department", department);
    
    if (error) {
      console.error(`Error fetching employees from department ${department}:`, error);
      toast({
        title: "Failed to fetch employees by department",
        description: error.message,
        variant: "destructive",
      });
      // Fallback to mock data
      return mockEmployees.filter(emp => emp.department === department);
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, filter mock data
    return mockEmployees.filter(emp => emp.department === department);
  } catch (error) {
    console.error(`Error fetching employees from department ${department}:`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch employees by department",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => emp.department === department);
  }
}
