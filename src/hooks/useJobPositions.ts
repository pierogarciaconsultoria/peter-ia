
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
        
        // Transform the data to ensure required_procedures, required_resources and required_ppe exist and status is properly typed
        const transformedData = (data || []).map(job => ({
          ...job,
          // Ensure status is one of the allowed literal types
          status: (['approved', 'draft', 'in_review', 'distributed'].includes(job.status) 
            ? job.status as "approved" | "draft" | "in_review" | "distributed"
            : 'draft' as const),
          // Ensure required_procedures is always a string array
          required_procedures: Array.isArray((job as any).required_procedures) 
            ? (job as any).required_procedures.map(String)
            : [],
          // Ensure required_resources is always a string array
          required_resources: Array.isArray((job as any).required_resources)
            ? (job as any).required_resources.map(String)
            : [],
          // Ensure required_ppe is always a string array
          required_ppe: Array.isArray((job as any).required_ppe)
            ? (job as any).required_ppe.map(String)
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
