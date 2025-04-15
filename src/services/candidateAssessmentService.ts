
import { supabase } from "@/integrations/supabase/client";
import { CandidateAssessment, AssessmentLink, AssessmentResponse } from "@/types/recruitment";
import { toast } from "sonner";

export const createAssessment = async (assessment: Omit<CandidateAssessment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('candidate_assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating assessment:", error);
    toast.error("Erro ao criar avaliação");
    return null;
  }
};

export const getAssessments = async (): Promise<CandidateAssessment[]> => {
  try {
    const { data, error } = await supabase
      .from('candidate_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching assessments:", error);
    return [];
  }
};

export const generateAssessmentLink = async (
  assessment_id: string,
  candidate_name: string,
  candidate_email: string,
  recruitment_process_id?: string
): Promise<AssessmentLink | null> => {
  try {
    const { data, error } = await supabase
      .from('candidate_assessment_links')
      .insert({
        assessment_id,
        candidate_name,
        candidate_email,
        recruitment_process_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error generating assessment link:", error);
    toast.error("Erro ao gerar link para avaliação");
    return null;
  }
};

export const validateAssessmentLink = async (token: string): Promise<AssessmentLink | null> => {
  try {
    const { data, error } = await supabase
      .from('candidate_assessment_links')
      .select('*, candidate_assessments(*)')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error validating assessment link:", error);
    return null;
  }
};

export const submitAssessmentResponse = async (
  linkId: string,
  response: Omit<AssessmentResponse, 'id' | 'submitted_at'>
): Promise<boolean> => {
  try {
    const { error: responseError } = await supabase
      .from('candidate_assessment_responses')
      .insert(response);

    if (responseError) throw responseError;

    // Mark link as used
    const { error: linkError } = await supabase
      .from('candidate_assessment_links')
      .update({ used: true })
      .eq('id', linkId);

    if (linkError) throw linkError;

    return true;
  } catch (error) {
    console.error("Error submitting assessment response:", error);
    return false;
  }
};
