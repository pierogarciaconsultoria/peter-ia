
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const fetchEvaluations = async () => {
    setIsLoading(true);
    try {
      const data = await getTrialEvaluations();
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load trial evaluations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvaluation = async (evaluation: any) => {
    try {
      await createTrialEvaluation(evaluation);
      toast({
        title: "Success",
        description: "Trial evaluation created successfully",
      });
      fetchEvaluations();
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create trial evaluation",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEvaluation = async (id: string, evaluation: any) => {
    try {
      await updateTrialEvaluation(id, evaluation);
      toast({
        title: "Success",
        description: "Trial evaluation updated successfully",
      });
      fetchEvaluations();
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update trial evaluation",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      await deleteTrialEvaluation(id);
      toast({
        title: "Success",
        description: "Trial evaluation deleted successfully",
      });
      fetchEvaluations();
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete trial evaluation",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateEvaluations = async (employee_id: string, hire_date: string) => {
    try {
      await generateTrialEvaluations(employee_id, hire_date);
      toast({
        title: "Success",
        description: "Trial evaluations generated successfully",
      });
      fetchEvaluations();
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate trial evaluations",
        variant: "destructive",
      });
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
