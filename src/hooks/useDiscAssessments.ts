
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
        const { data, error } = await supabase
          .from("disc_assessments")
          .select("*")
          .order("date", { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface with proper type checking
          const formattedData: DiscAssessment[] = data.map(item => {
            // Safely cast the scores from Json to DiscScore
            const scoresData = item.scores as Record<string, number>;
            const scores: DiscScore = {
              D: scoresData.D || 0,
              I: scoresData.I || 0,
              S: scoresData.S || 0,
              C: scoresData.C || 0
            };
            
            return {
              id: item.id,
              name: item.name,
              email: item.email,
              scores: scores,
              primary_type: item.primary_type as DiscType,
              invited_by: item.invited_by,
              date: item.date
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
      // Convert DiscScore to a format acceptable by Supabase (plain object)
      const scoresForDb = {
        D: assessment.scores.D,
        I: assessment.scores.I,
        S: assessment.scores.S,
        C: assessment.scores.C
      };

      try {
        const { data, error } = await supabase
          .from("disc_assessments")
          .insert({
            name: assessment.name,
            email: assessment.email,
            scores: scoresForDb,  // Use the plain object which is compatible with Json type
            primary_type: assessment.primary_type,
            invited_by: assessment.invited_by,
            date: new Date().toISOString()
          })
          .select("*")
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
