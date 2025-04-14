
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface DiscAssessment {
  id: string;
  name: string;
  email: string;
  date: string;
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  primary_type: 'D' | 'I' | 'S' | 'C';
  invited_by?: string | null;
}

export interface AssessmentLink {
  token: string;
  name: string;
  email: string;
  expires_at: Date;
  used: boolean;
}

export const createAssessment = async (assessment: Omit<DiscAssessment, "id" | "date">) => {
  try {
    const { data, error } = await supabase
      .from('disc_assessments')
      .insert({
        ...assessment,
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating DISC assessment:', error);
    throw error;
  }
};

export const generateAssessmentLink = async (name: string, email: string): Promise<string> => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Link expires in 7 days

  try {
    const { error } = await supabase
      .from('disc_assessment_links')
      .insert({
        token,
        name,
        email,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (error) throw error;

    // Return the assessment URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/disc-assessment/${token}`;
  } catch (error) {
    console.error('Error generating assessment link:', error);
    throw error;
  }
};

export const validateAssessmentLink = async (token: string): Promise<AssessmentLink | null> => {
  try {
    const { data, error } = await supabase
      .from('disc_assessment_links')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) return null;

    const link = data as AssessmentLink;
    const now = new Date();
    
    if (new Date(link.expires_at) < now || link.used) {
      return null;
    }

    return link;
  } catch (error) {
    console.error('Error validating assessment link:', error);
    return null;
  }
};

export const markAssessmentLinkAsUsed = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('disc_assessment_links')
      .update({ used: true })
      .eq('token', token);

    return !error;
  } catch (error) {
    console.error('Error marking assessment link as used:', error);
    return false;
  }
};
