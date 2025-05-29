
import { supabase } from "@/integrations/supabase/client";
import { CreateDiscAssessmentParams, DiscAssessment } from "@/types/disc";

/**
 * Create a new DISC assessment
 */
export const createAssessment = async (assessment: CreateDiscAssessmentParams): Promise<DiscAssessment> => {
  try {
    const { data, error } = await supabase
      .from('disc_assessments')
      .insert([{
        name: assessment.name,
        email: assessment.email,
        scores: assessment.scores,
        primary_type: assessment.primary_type,
        invited_by: assessment.invited_by,
        date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      scores: data.scores as any,
      primary_type: data.primary_type,
      date: data.date,
      invited_by: data.invited_by,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error creating DISC assessment:', error);
    throw error;
  }
};

/**
 * Fetch all DISC assessments
 */
export const fetchAllAssessments = async (): Promise<DiscAssessment[]> => {
  try {
    const { data, error } = await supabase
      .from('disc_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => {
      const rawScores = item.scores as any;
      const normalizedScores = {
        d: rawScores?.d ?? rawScores?.D ?? 0,
        i: rawScores?.i ?? rawScores?.I ?? 0,
        s: rawScores?.s ?? rawScores?.S ?? 0,
        c: rawScores?.c ?? rawScores?.C ?? 0
      };

      return {
        id: item.id,
        name: item.name,
        email: item.email,
        scores: normalizedScores,
        primary_type: item.primary_type,
        date: item.date || item.created_at,
        invited_by: item.invited_by,
        created_at: item.created_at
      };
    });
  } catch (error) {
    console.error('Error fetching DISC assessments:', error);
    throw error;
  }
};
