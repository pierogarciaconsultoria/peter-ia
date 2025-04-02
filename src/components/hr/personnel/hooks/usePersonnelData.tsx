
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "../../types";
import { PersonnelRequest } from "../types";
import { mockRequests } from "../mock-data";

export function usePersonnelData() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PersonnelRequest[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch job positions and employees from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch job positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('job_positions')
          .select('*');
        
        if (positionsError) {
          console.error('Error fetching job positions:', positionsError);
          toast({
            title: "Erro ao carregar cargos",
            description: "Não foi possível carregar a lista de cargos.",
            variant: "destructive",
          });
          return;
        }
        
        if (positionsData) {
          // Add required fields to match JobPosition type
          const formattedPositions: JobPosition[] = positionsData.map((pos: any) => ({
            id: pos.id,
            title: pos.title,
            department: pos.department,
            description: pos.description,
            code: pos.code || '',
            revision: pos.revision || '1.0',
            is_supervisor: pos.is_supervisor || false,
            is_department_head: pos.is_department_head || false,
            superior_position_id: pos.superior_position_id,
            status: (pos.status as "draft" | "approved" | "in_review" | "distributed") || "approved",
            approval_date: pos.approval_date,
            approver: pos.approver,
            immediate_supervisor_position: pos.immediate_supervisor_position,
            cbo_code: pos.cbo_code,
            norm: pos.norm,
            main_responsibilities: pos.main_responsibilities,
            education_requirements: pos.education_requirements,
            skill_requirements: pos.skill_requirements,
            training_requirements: pos.training_requirements,
            experience_requirements: pos.experience_requirements,
            required_procedures: pos.required_procedures,
            required_resources: pos.required_resources,
            required_ppe: pos.required_ppe,
          }));
          setJobPositions(formattedPositions);
        }
        
        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
        
        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          return;
        }
        
        if (employeesData) {
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error('Error in data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // For demo purposes, we'll continue using the mock requests
    setRequests(mockRequests);
  }, [toast]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh - in a real app this would fetch fresh data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    requests,
    setRequests,
    jobPositions,
    employees,
    isLoading,
    handleRefresh
  };
}
