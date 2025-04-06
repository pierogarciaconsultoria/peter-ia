
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "../types";
import { mockEmployees } from "../mockData";
import { toast } from "@/components/ui/use-toast";
import { getEmployees } from "../employeeBasicService";

/**
 * Search employees by name, email, position or department
 */
export async function searchEmployees(searchTerm: string): Promise<Employee[]> {
  try {
    if (!searchTerm.trim()) {
      return getEmployees();
    }

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`);
    
    if (error) {
      console.error(`Error searching employees with term "${searchTerm}":`, error);
      toast({
        title: "Failed to search employees",
        description: error.message,
        variant: "destructive",
      });
      // Fallback to mock data
      return mockEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (data && data.length > 0) {
      return data as Employee[];
    }
    
    // If no data returned but no error, search mock data
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error(`Error searching employees with term "${searchTerm}":`, error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not complete the search",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
