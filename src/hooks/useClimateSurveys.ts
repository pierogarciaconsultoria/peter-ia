
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ClimateSurvey,
  ClimateSurveyQuestion,
  getClimateSurveys,
  createClimateSurvey,
  updateClimateSurvey,
  deleteClimateSurvey,
  getSurveyQuestions,
  createSurveyQuestion,
  updateSurveyQuestion,
  deleteSurveyQuestion,
  reorderSurveyQuestions
} from "@/services/climateSurveyService";

export function useClimateSurveys() {
  const [surveys, setSurveys] = useState<ClimateSurvey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSurvey, setCurrentSurvey] = useState<ClimateSurvey | null>(null);
  const [questions, setQuestions] = useState<ClimateSurveyQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Buscar todas as pesquisas
  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getClimateSurveys();
      setSurveys(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar pesquisas de clima");
      toast.error("Erro ao carregar pesquisas", {
        description: "Não foi possível obter a lista de pesquisas de clima"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar uma pesquisa e suas perguntas
  const fetchSurveyWithQuestions = useCallback(async (surveyId: string) => {
    setIsLoading(true);
    setIsLoadingQuestions(true);
    setError(null);
    
    try {
      // Encontrar a pesquisa na lista atual ou buscar novamente
      let survey = surveys.find(s => s.id === surveyId);
      if (!survey) {
        await fetchSurveys();
        survey = surveys.find(s => s.id === surveyId);
      }
      
      if (survey) {
        setCurrentSurvey(survey);
        
        // Buscar as perguntas
        const questionsData = await getSurveyQuestions(surveyId);
        setQuestions(questionsData);
      } else {
        throw new Error("Pesquisa não encontrada");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar detalhes da pesquisa");
      toast.error("Erro ao carregar pesquisa", {
        description: "Não foi possível obter os detalhes da pesquisa de clima"
      });
    } finally {
      setIsLoading(false);
      setIsLoadingQuestions(false);
    }
  }, [surveys, fetchSurveys]);

  // Criar nova pesquisa
  const createSurvey = useCallback(async (survey: Omit<ClimateSurvey, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSurvey = await createClimateSurvey(survey);
      if (newSurvey) {
        setSurveys(prev => [newSurvey, ...prev]);
        toast.success("Pesquisa criada com sucesso");
        return newSurvey;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao criar pesquisa", {
        description: err.message || "Não foi possível criar a pesquisa de clima"
      });
      return null;
    }
  }, []);

  // Atualizar pesquisa existente
  const updateSurvey = useCallback(async (id: string, surveyData: Partial<ClimateSurvey>) => {
    try {
      const updatedSurvey = await updateClimateSurvey(id, surveyData);
      if (updatedSurvey) {
        setSurveys(prev => prev.map(survey => 
          survey.id === id ? updatedSurvey : survey
        ));
        
        if (currentSurvey?.id === id) {
          setCurrentSurvey(updatedSurvey);
        }
        
        toast.success("Pesquisa atualizada com sucesso");
        return updatedSurvey;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao atualizar pesquisa", {
        description: err.message || "Não foi possível atualizar a pesquisa de clima"
      });
      return null;
    }
  }, [currentSurvey]);

  // Excluir pesquisa
  const removeSurvey = useCallback(async (id: string) => {
    try {
      const success = await deleteClimateSurvey(id);
      if (success) {
        setSurveys(prev => prev.filter(survey => survey.id !== id));
        
        if (currentSurvey?.id === id) {
          setCurrentSurvey(null);
          setQuestions([]);
        }
        
        toast.success("Pesquisa excluída com sucesso");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Erro ao excluir pesquisa", {
        description: err.message || "Não foi possível excluir a pesquisa de clima"
      });
      return false;
    }
  }, [currentSurvey]);

  // Adicionar nova pergunta
  const addQuestion = useCallback(async (question: Omit<ClimateSurveyQuestion, 'id'>) => {
    try {
      const newQuestion = await createSurveyQuestion(question);
      if (newQuestion) {
        setQuestions(prev => [...prev, newQuestion].sort((a, b) => a.order_number - b.order_number));
        toast.success("Pergunta adicionada com sucesso");
        return newQuestion;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao adicionar pergunta", {
        description: err.message || "Não foi possível adicionar a pergunta à pesquisa"
      });
      return null;
    }
  }, []);

  // Atualizar pergunta existente
  const updateQuestion = useCallback(async (id: string, questionData: Partial<ClimateSurveyQuestion>) => {
    try {
      const updatedQuestion = await updateSurveyQuestion(id, questionData);
      if (updatedQuestion) {
        setQuestions(prev => prev.map(question => 
          question.id === id ? updatedQuestion : question
        ));
        toast.success("Pergunta atualizada com sucesso");
        return updatedQuestion;
      }
      return null;
    } catch (err: any) {
      toast.error("Erro ao atualizar pergunta", {
        description: err.message || "Não foi possível atualizar a pergunta"
      });
      return null;
    }
  }, []);

  // Remover pergunta
  const removeQuestion = useCallback(async (id: string) => {
    try {
      const success = await deleteSurveyQuestion(id);
      if (success) {
        setQuestions(prev => prev.filter(question => question.id !== id));
        toast.success("Pergunta removida com sucesso");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Erro ao remover pergunta", {
        description: err.message || "Não foi possível remover a pergunta"
      });
      return false;
    }
  }, []);

  // Reordenar perguntas
  const reorderQuestions = useCallback(async (reorderedQuestions: { id: string, order_number: number }[]) => {
    try {
      // Atualiza a UI imediatamente para uma experiência mais responsiva
      const updatedQuestions = [...questions];
      reorderedQuestions.forEach(({ id, order_number }) => {
        const index = updatedQuestions.findIndex(q => q.id === id);
        if (index !== -1) {
          updatedQuestions[index] = { ...updatedQuestions[index], order_number };
        }
      });
      
      // Ordena as perguntas pelo novo order_number
      updatedQuestions.sort((a, b) => a.order_number - b.order_number);
      setQuestions(updatedQuestions);
      
      // Persiste as alterações no banco
      const success = await reorderSurveyQuestions(reorderedQuestions);
      if (!success) {
        throw new Error("Falha ao salvar a nova ordem das perguntas");
      }
      
      return true;
    } catch (err: any) {
      toast.error("Erro ao reordenar perguntas", {
        description: err.message || "Não foi possível atualizar a ordem das perguntas"
      });
      return false;
    }
  }, [questions]);

  // Carregar pesquisas ao montar o componente
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return {
    surveys,
    isLoading,
    error,
    currentSurvey,
    questions,
    isLoadingQuestions,
    fetchSurveys,
    fetchSurveyWithQuestions,
    createSurvey,
    updateSurvey,
    removeSurvey,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions
  };
}
