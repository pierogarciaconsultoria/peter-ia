
import { supabase } from "@/integrations/supabase/client";
import { mockEmployees } from "../mockData";
import { toast } from "@/components/ui/use-toast";

/**
 * Gets only quality inspectors (employees with position "Inspetor de Qualidade")
 */
export async function getQualityInspectors() {
  try {
    // Attempt to fetch from Supabase with appropriate filters
    const { data, error } = await supabase
      .from("employees")
      .select("id, name")
      .eq("position", "Inspetor de Qualidade")
      .eq("status", "active");
    
    if (error) {
      console.error("Error fetching quality inspectors from Supabase:", error);
      toast({
        title: "Failed to fetch quality inspectors",
        description: error.message,
        variant: "destructive",
      });
      // Fallback to filtering mock data
      return mockEmployees
        .filter(emp => 
          emp.position === "Inspetor de Qualidade" && 
          emp.status === "active"
        )
        .map(emp => ({
          id: emp.id,
          name: emp.name
        }));
    }
    
    if (data && data.length > 0) {
      return data;
    }
    
    // If no data returned but no error, return filtered mock data
    return mockEmployees
      .filter(emp => 
        emp.position === "Inspetor de Qualidade" && 
        emp.status === "active"
      )
      .map(emp => ({
        id: emp.id,
        name: emp.name
      }));
  } catch (error) {
    console.error("Error fetching quality inspectors:", error);
    toast({
      title: "An unexpected error occurred",
      description: "Could not fetch quality inspectors",
      variant: "destructive",
    });
    // Fallback to mock data in case of exception
    return mockEmployees
      .filter(emp => 
        emp.position === "Inspetor de Qualidade" && 
        emp.status === "active"
      )
      .map(emp => ({
        id: emp.id,
        name: emp.name
      }));
  }
}
