
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export type DiscType = 'D' | 'I' | 'S' | 'C';

export interface DiscScore {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscAssessment {
  id: string;
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: DiscType;
  invited_by?: string | null;
  date: string;
}

interface CreateDiscAssessmentInput {
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: string;
  invited_by?: string;
}

export function useDiscAssessments() {
  const [assessments, setAssessments] = useState<DiscAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAssessments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("disc_assessments")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const formattedData: DiscAssessment[] = data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        scores: item.scores as DiscScore,
        primary_type: item.primary_type as DiscType,
        invited_by: item.invited_by,
        date: item.date
      }));
      
      setAssessments(formattedData);
    } catch (err: any) {
      console.error("Error fetching DISC assessments:", err);
      setError(err.message || "Erro ao carregar avaliações DISC");
      toast({
        title: "Erro ao carregar avaliações DISC",
        description: "Não foi possível carregar a lista de avaliações DISC.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAssessment = async (assessment: CreateDiscAssessmentInput) => {
    try {
      const { data, error } = await supabase
        .from("disc_assessments")
        .insert({
          name: assessment.name,
          email: assessment.email,
          scores: assessment.scores,
          primary_type: assessment.primary_type,
          invited_by: assessment.invited_by
        })
        .select("*")
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Avaliação DISC criada",
        description: "A avaliação DISC foi criada com sucesso.",
      });
      
      return data;
    } catch (err: any) {
      console.error("Error creating DISC assessment:", err);
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
