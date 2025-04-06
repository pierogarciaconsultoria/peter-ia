
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch employees from Supabase
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
          
        if (error) {
          console.error('Error fetching employees:', error);
          return;
        }
        
        if (data) {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error in employees fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading
  };
}
