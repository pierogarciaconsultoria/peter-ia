
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
    // Since the disc_assessment_links table doesn't exist in the schema yet,
    // we'll simulate the functionality and store links in memory for now
    console.log('Generated assessment link for', name, email, 'with token', token);

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
    // For demonstration, we'll simulate a valid token
    // In a real implementation, this would check the database
    console.log('Validating assessment link with token', token);
    
    // Simulating a valid link
    return {
      token,
      name: "Usuário de Teste",
      email: "usuario@example.com",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      used: false
    };
  } catch (error) {
    console.error('Error validating assessment link:', error);
    return null;
  }
};

export const markAssessmentLinkAsUsed = async (token: string): Promise<boolean> => {
  try {
    // Simulating marking the link as used
    console.log('Marking assessment link as used:', token);
    return true;
  } catch (error) {
    console.error('Error marking assessment link as used:', error);
    return false;
  }
};
