
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { toast as sonnerToast } from "sonner";

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

// Type for Supabase JSON
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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

  // Create a stable reference to the fetchAssessments function using useCallback
  const fetchAssessments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for development if Supabase is unavailable
      const mockData = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          scores: { D: 8, I: 3, S: 2, C: 5 },
          primary_type: "D" as DiscType,
          invited_by: null,
          date: new Date().toISOString()
        },
        {
          id: "2",
          name: "Maria Santos",
          email: "maria@example.com",
          scores: { D: 2, I: 7, S: 4, C: 3 },
          primary_type: "I" as DiscType,
          invited_by: null,
          date: new Date().toISOString()
        },
        {
          id: "3",
          name: "Carlos Oliveira",
          email: "carlos@example.com",
          scores: { D: 3, I: 2, S: 8, C: 3 },
          primary_type: "S" as DiscType,
          invited_by: null,
          date: new Date().toISOString()
        }
      ];

      // Check if there are any local assessments stored
      const localAssessments = localStorage.getItem('local_disc_assessments');
      const localData = localAssessments ? JSON.parse(localAssessments) : [];

      try {
        // Usar a tabela correta hr_disc_evaluations
        const { data, error } = await supabase
          .from("hr_disc_evaluations")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface with proper type checking
          const formattedData: DiscAssessment[] = data.map(item => {
            // Criando objeto de scores a partir dos campos individuais
            const scores: DiscScore = {
              D: item.dominance_score || 0,
              I: item.influence_score || 0,
              S: item.steadiness_score || 0,
              C: item.compliance_score || 0
            };
            
            return {
              id: item.id,
              name: item.employee_id ? "Funcionário" : "Candidato", // Adaptar conforme estrutura
              email: "email@exemplo.com", // Adaptar conforme estrutura
              scores: scores,
              primary_type: item.primary_type as DiscType,
              invited_by: null,
              date: item.created_at
            };
          });
          
          // Combine database assessments with local assessments
          setAssessments([...formattedData, ...localData]);
        } else {
          // If no data is returned from Supabase, use local data + mock data
          console.log("No data from Supabase, using local and mock data");
          setAssessments([...localData, ...mockData]);
        }
      } catch (err) {
        console.error("Error fetching DISC assessments from Supabase:", err);
        // Fall back to mock data when Supabase fails
        console.log("Falling back to local and mock data due to Supabase error");
        setAssessments([...localData, ...mockData]);
        
        // Show a toast but continue with mock data
        sonnerToast.warning("Usando dados locais", {
          description: "Não foi possível conectar ao banco de dados"
        });
      }
    } catch (err: any) {
      console.error("Error in fetchAssessments:", err);
      setError(err.message || "Erro ao carregar avaliações DISC");
      
      // Don't stop the UI from rendering - provide empty data
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAssessment = async (assessment: CreateDiscAssessmentInput) => {
    try {
      // Adaptação para o formato da nova tabela hr_disc_evaluations
      try {
        const { data, error } = await supabase
          .from("hr_disc_evaluations")
          .insert({
            employee_id: null, // Substituir pelo ID do funcionário se disponível
            dominance_score: assessment.scores.D,
            influence_score: assessment.scores.I,
            steadiness_score: assessment.scores.S,
            compliance_score: assessment.scores.C,
            primary_type: assessment.primary_type,
            evaluation_date: new Date().toISOString(),
            company_id: 'default-company-id', // Substituir pelo ID da empresa
          })
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Avaliação DISC criada",
          description: "A avaliação DISC foi criada com sucesso.",
        });
        
        return data;
      } catch (err) {
        console.error("Error creating DISC assessment in Supabase:", err);
        
        // Create a local mock entry
        const mockEntry = {
          id: `local-${Date.now()}`,
          name: assessment.name,
          email: assessment.email,
          scores: assessment.scores,
          primary_type: assessment.primary_type as DiscType,
          invited_by: assessment.invited_by,
          date: new Date().toISOString()
        };
        
        // Store locally
        const localAssessments = localStorage.getItem('local_disc_assessments');
        const localData = localAssessments ? JSON.parse(localAssessments) : [];
        localData.push(mockEntry);
        localStorage.setItem('local_disc_assessments', JSON.stringify(localData));
        
        // Update local state
        setAssessments(prev => [mockEntry, ...prev]);
        
        toast({
          title: "Avaliação DISC criada localmente",
          description: "A avaliação foi armazenada localmente devido a problemas de conexão.",
          variant: "default",
        });
        
        return mockEntry;
      }
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
