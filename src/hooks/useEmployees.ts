
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Employee, JobPosition } from "@/components/hr/types/employee";

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
          const mockEmployeeData = [
            {
              id: "1",
              name: "João Silva",
              email: "joao.silva@exemplo.com",
              department: "Produção",
              position: "Gerente de Produção",
              position_id: "pos1", 
              status: "active" as const,
              hire_date: "2020-03-15",
              avatar_url: "",
            },
            {
              id: "2",
              name: "Maria Oliveira",
              email: "maria.oliveira@exemplo.com",
              department: "Recursos Humanos",
              position: "Coordenadora de RH",
              position_id: "pos2",
              status: "active" as const,
              hire_date: "2019-08-22",
              avatar_url: "",
            },
            {
              id: "3",
              name: "Pedro Santos",
              email: "pedro.santos@exemplo.com",
              department: "TI",
              position: "Desenvolvedor Sênior",
              position_id: "pos3",
              status: "active" as const,
              hire_date: "2021-01-10",
              avatar_url: "",
            },
            {
              id: "4",
              name: "Ana Ferreira",
              email: "ana.ferreira@exemplo.com",
              department: "Vendas",
              position: "Executiva de Contas",
              position_id: "pos4",
              status: "on_leave" as const,
              hire_date: "2018-11-05",
              avatar_url: "",
            },
            {
              id: "5",
              name: "Carlos Mendes",
              email: "carlos.mendes@exemplo.com",
              department: "Financeiro",
              position: "Analista Financeiro",
              position_id: "pos5",
              status: "inactive" as const,
              hire_date: "2017-05-18",
              avatar_url: "",
            },
          ];
          
          setEmployees(mockEmployeeData);
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
