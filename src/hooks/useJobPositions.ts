
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobPosition } from "@/components/hr/types";
import { supabase } from "@/integrations/supabase/client";

export function useJobPositions() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobPositions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('job_positions')
          .select('*')
          .order('title');
        
        if (error) throw error;
        
        // Transform the data to ensure required_procedures exists
        const transformedData = (data || []).map(job => ({
          ...job,
          // Ensure required_procedures is always an array
          required_procedures: Array.isArray((job as any).required_procedures) 
            ? (job as any).required_procedures 
            : []
        })) as JobPosition[];
        
        setJobPositions(transformedData);
      } catch (error) {
        console.error("Error loading job positions:", error);
        toast({
          title: "Erro ao carregar cargos",
          description: "Não foi possível carregar a lista de cargos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPositions();
  }, [toast]);

  const getJobPositionById = (id: string): JobPosition | undefined => {
    return jobPositions.find(position => position.id === id);
  };

  return {
    jobPositions,
    isLoading,
    getJobPositionById
  };
}
