
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getTrialEvaluations,
  createTrialEvaluation,
  updateTrialEvaluation,
  deleteTrialEvaluation,
  generateTrialEvaluations,
  TrialEvaluationWithEmployee
} from '@/services/trialEvaluationService';

export function useTrialEvaluations() {
  const [evaluations, setEvaluations] = useState<TrialEvaluationWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvaluations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getTrialEvaluations();
      setEvaluations(data);
    } catch (err) {
      console.error("Error fetching trial evaluations:", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar avaliações'));
      toast.error("Falha ao carregar avaliações de período de experiência");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvaluation = async (evaluation: any) => {
    try {
      await createTrialEvaluation(evaluation);
      toast.success("Avaliação criada com sucesso");
      await fetchEvaluations();
      return true;
    } catch (err) {
      console.error("Error creating evaluation:", err);
      toast.error("Falha ao criar avaliação");
      return false;
    }
  };

  const updateEvaluation = async (id: string, evaluation: any) => {
    try {
      await updateTrialEvaluation(id, evaluation);
      toast.success("Avaliação atualizada com sucesso");
      await fetchEvaluations();
      return true;
    } catch (err) {
      console.error("Error updating evaluation:", err);
      toast.error("Falha ao atualizar avaliação");
      return false;
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      await deleteTrialEvaluation(id);
      toast.success("Avaliação excluída com sucesso");
      await fetchEvaluations();
      return true;
    } catch (err) {
      console.error("Error deleting evaluation:", err);
      toast.error("Falha ao excluir avaliação");
      return false;
    }
  };

  const generateEvaluations = async (employee_id: string, hire_date: string) => {
    try {
      await generateTrialEvaluations(employee_id, hire_date);
      toast.success("Avaliações geradas com sucesso");
      await fetchEvaluations();
      return true;
    } catch (err) {
      console.error("Error generating evaluations:", err);
      toast.error("Falha ao gerar avaliações");
      return false;
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return {
    evaluations,
    isLoading,
    error,
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    generateEvaluations
  };
}
