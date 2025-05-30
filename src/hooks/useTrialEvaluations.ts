
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getTrialEvaluations,
  createTrialEvaluation,
  updateTrialEvaluation,
  generateTrialEvaluationsBR,
  TrialEvaluationWithEmployee,
  TrialEvaluation
} from "@/services/trialEvaluationService";

export function useTrialEvaluations() {
  const [evaluations, setEvaluations] = useState<TrialEvaluationWithEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      const data = await getTrialEvaluations();
      setEvaluations(data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar avaliações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvaluation = async (evaluation: Partial<TrialEvaluation>) => {
    try {
      const success = await createTrialEvaluation(evaluation);
      if (success) {
        await fetchEvaluations();
        toast({
          title: "Sucesso",
          description: "Avaliação criada com sucesso."
        });
      }
      return success;
    } catch (error) {
      console.error("Error creating evaluation:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateEvaluation = async (id: string, evaluation: Partial<TrialEvaluation>) => {
    try {
      const success = await updateTrialEvaluation(id, evaluation);
      if (success) {
        await fetchEvaluations();
        toast({
          title: "Sucesso",
          description: "Avaliação atualizada com sucesso."
        });
      }
      return success;
    } catch (error) {
      console.error("Error updating evaluation:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação.",
        variant: "destructive"
      });
      return false;
    }
  };

  const generateEvaluations = async (employeeId: string, hireDate: string) => {
    try {
      const success = await generateTrialEvaluationsBR(employeeId, hireDate);
      if (success) {
        await fetchEvaluations();
        toast({
          title: "Sucesso",
          description: "Avaliações geradas automaticamente."
        });
      }
      return success;
    } catch (error) {
      console.error("Error generating evaluations:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar avaliações.",
        variant: "destructive"
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
    fetchEvaluations,
    createEvaluation,
    updateEvaluation,
    generateEvaluations
  };
}
