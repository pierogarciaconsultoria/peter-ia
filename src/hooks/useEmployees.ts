
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Employee, JobPosition } from "@/components/hr/types/employee";
import { generateMockEmployees } from "@/utils/mockEmployeeData";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userCompany } = useAuth();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  // Fetch job positions and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (!userCompany?.id) {
          console.log("No company ID available, waiting...");
          return;
        }
        
        // Fetch job positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('job_positions')
          .select('id, title, department, description')
          .eq('company_id', userCompany.id);
        
        if (positionsError) {
          console.error('Error fetching job positions:', positionsError);
        } else {
          setJobPositions(positionsData || []);
        }
        
        // Fetch employees from the company
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', userCompany.id)
          .order('name');
        
        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          return;
        }
        
        // If we got employees, use those. Otherwise fall back to mock data for demo purposes
        if (employeesData && employeesData.length > 0) {
          const enrichedEmployees = employeesData.map(employee => {
            const positionDetails = positionsData?.find(p => p.title === employee.position);
            return {
              ...employee,
              status: employee.status as "active" | "inactive" | "on_leave",
              position_details: positionDetails
            };
          });
          
          setEmployees(enrichedEmployees);
        } else {
          // For demo, we'll use mock data
          setEmployees(generateMockEmployees());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userCompany?.id]);

  return {
    employees,
    jobPositions,
    isLoading,
    formatDate
  };
}
