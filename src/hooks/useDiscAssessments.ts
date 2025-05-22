
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { 
  DiscAssessment, 
  DiscScore, 
  DiscType, 
  createAssessment as createDiscAssessment,
  fetchAllAssessments
} from "@/services/discAssessmentService";

export type { DiscType, DiscScore, DiscAssessment };

interface CreateDiscAssessmentInput {
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: string;
  invited_by?: string;
}

/**
 * Hook for managing DISC assessments
 * @returns Object with assessments, loading state, error, and methods to fetch and create assessments
 */
export function useDiscAssessments() {
  const [assessments, setAssessments] = useState<DiscAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Fetches all DISC assessments
   */
  const fetchAssessments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllAssessments();
      setAssessments(data);
    } catch (err: any) {
      console.error("Error in fetchAssessments:", err);
      setError(err.message || "Erro ao carregar avaliações DISC");
      // Don't stop the UI from rendering - provide empty data
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Creates a new DISC assessment
   * @param assessment The assessment data to create
   * @returns The created assessment
   */
  const createAssessment = async (assessment: CreateDiscAssessmentInput) => {
    try {
      const newAssessment = await createDiscAssessment({
        name: assessment.name,
        email: assessment.email,
        scores: assessment.scores,
        primary_type: assessment.primary_type as DiscType,
        invited_by: assessment.invited_by
      });
      
      // Update local state
      setAssessments(prev => [newAssessment, ...prev]);
      
      toast({
        title: "Avaliação DISC criada",
        description: "A avaliação DISC foi criada com sucesso.",
      });
      
      return newAssessment;
    } catch (err: any) {
      console.error("Error in createAssessment:", err);
      toast({
        title: "Erro ao criar avaliação DISC",
        description: err.message || "Não foi possível criar a avaliação DISC.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    assessments,
    isLoading,
    error,
    fetchAssessments,
    createAssessment,
  };
}
