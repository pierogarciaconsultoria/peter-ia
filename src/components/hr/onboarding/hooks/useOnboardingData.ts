
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProcess, JobPosition } from "../types";

export function useOnboardingData() {
  const [onboardingProcesses, setOnboardingProcesses] = useState<OnboardingProcess[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch job positions and onboarding processes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('job_positions')
          .select('id, title, department, description');
        
        if (positionsError) {
          console.error('Error fetching job positions:', positionsError);
          return;
        }
        
        setJobPositions(positionsData || []);
        
        // For demo, we'll use mock data for onboarding processes
        // but in a real app we'd fetch from the database
        const mockOnboardingData = [
          {
            id: "onb1",
            employeeName: "Pedro Costa",
            position: "Desenvolvedor Full Stack",
            position_id: "pos1",
            startDate: "2023-10-15",
            progress: 75,
            status: "em_andamento",
            department: "Tecnologia"
          },
          {
            id: "onb2",
            employeeName: "Mariana Silva",
            position: "Analista de Marketing",
            position_id: "pos2",
            startDate: "2023-11-05",
            progress: 30,
            status: "em_andamento",
            department: "Marketing"
          },
          {
            id: "onb3",
            employeeName: "Roberto Alves",
            position: "Gerente de Projetos",
            position_id: "pos3",
            startDate: "2023-09-22",
            progress: 100,
            status: "concluido",
            department: "Operações"
          }
        ];
        
        // Merge onboarding data with job position details
        const enrichedOnboarding = mockOnboardingData.map(process => {
          const positionDetails = positionsData?.find(p => p.id === process.position_id);
          return {
            ...process,
            position_details: positionDetails
          };
        });
        
        setOnboardingProcesses(enrichedOnboarding);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { onboardingProcesses, jobPositions, isLoading };
}
