
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types";
import { mockEmployees } from "../mockData";
import { toast } from "@/components/ui/use-toast";

/**
 * Get employees by status
 */
export async function getEmployeesByStatus(status: 'active' | 'inactive' | 'on_leave'): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("status", status);
    
    if (error) {
      console.error(`Error fetching employees with status ${status}:`, error);
      toast({
        title: "Failed to fetch employees by status",
        description: error.message,
        variant: "destructive",
      });
      // Fallback to mock data
      return mockEmployees.filter(emp => emp.status === status);
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, filter mock data
    return mockEmployees.filter(emp => emp.status === status);
  } catch (error) {
    console.error(`Error fetching employees with status ${status}:`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch employees by status",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => emp.status === status);
  }
}
