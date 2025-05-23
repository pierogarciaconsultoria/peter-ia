
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DiscAssessment, DiscType, CreateDiscAssessmentParams } from "./types";
import { createLocalAssessment, getLocalAssessments } from "./storage";

/**
 * Creates a new DISC assessment record
 * @param assessment The assessment data to create
 * @returns The created assessment
 */
export const createAssessment = async (assessment: CreateDiscAssessmentParams): Promise<DiscAssessment> => {
  try {
    // Try to insert into the hr_disc_evaluations table (new structure)
    try {
      const { data, error } = await supabase
        .from("hr_disc_evaluations")
        .insert({
          employee_id: null,
          dominance_score: assessment.scores.D,
          influence_score: assessment.scores.I,
          steadiness_score: assessment.scores.S,
          compliance_score: assessment.scores.C,
          primary_type: assessment.primary_type,
          evaluation_date: new Date().toISOString(),
          company_id: 'default-company-id', // Replace with actual company ID when available
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert to our DiscAssessment format
      return {
        id: data.id,
        name: assessment.name,
        email: assessment.email,
        scores: {
          D: data.dominance_score,
          I: data.influence_score,
          S: data.steadiness_score,
          C: data.compliance_score
        },
        primary_type: data.primary_type as DiscType,
        invited_by: assessment.invited_by,
        date: data.created_at
      };
    } catch (error) {
      console.error("Error creating DISC assessment in Supabase:", error);
      
      // Create a local assessment as fallback
      return createLocalAssessment(assessment);
    }
  } catch (error) {
    console.error("Error in createAssessment:", error);
    throw error;
  }
};

/**
 * Fetches all DISC assessments
 * @returns An array of DISC assessments
 */
export const fetchAllAssessments = async (): Promise<DiscAssessment[]> => {
  try {
    // Default mock data for development/fallback
    const mockData: DiscAssessment[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao@example.com",
        scores: { D: 8, I: 3, S: 2, C: 5 },
        primary_type: "D",
        invited_by: null,
        date: new Date().toISOString()
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@example.com",
        scores: { D: 2, I: 7, S: 4, C: 3 },
        primary_type: "I",
        invited_by: null,
        date: new Date().toISOString()
      },
      {
        id: "3",
        name: "Carlos Oliveira",
        email: "carlos@example.com",
        scores: { D: 3, I: 2, S: 8, C: 3 },
        primary_type: "S",
        invited_by: null,
        date: new Date().toISOString()
      }
    ];

    // Get local assessments
    const localData = getLocalAssessments();

    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from("hr_disc_evaluations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform to our DiscAssessment format
        const formattedData: DiscAssessment[] = data.map(item => {
          const scores = {
            D: item.dominance_score || 0,
            I: item.influence_score || 0,
            S: item.steadiness_score || 0,
            C: item.compliance_score || 0
          };
          
          return {
            id: item.id,
            name: item.employee_id ? "Funcionário" : "Candidato",
            email: "email@exemplo.com", // Adapt as needed
            scores,
            primary_type: item.primary_type as DiscType,
            invited_by: null,
            date: item.created_at
          };
        });
        
        return [...formattedData, ...localData];
      } else {
        // No data from Supabase, use local + mock
        console.log("No data from Supabase, using local and mock data");
        return [...localData, ...mockData];
      }
    } catch (error) {
      console.error("Error fetching DISC assessments from Supabase:", error);
      // Show warning toast but continue with mock data
      toast.warning("Usando dados locais", {
        description: "Não foi possível conectar ao banco de dados"
      });
      return [...localData, ...mockData];
    }
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return [];
  }
};
