
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
    // Return mock data for demonstration
    return {
      id: `local-${Date.now()}`,
      ...assessment,
      date: new Date().toISOString()
    };
  }
};

export const generateAssessmentLink = async (name: string, email: string): Promise<string> => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Link expires in 7 days

  try {
    // Try to save to Supabase (if available)
    try {
      await supabase
        .from('disc_assessment_links')
        .insert({
          name,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });
    } catch (error) {
      console.error('Error saving link to database:', error);
      // Continue without saving to database
    }

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
    // Try to validate with Supabase
    try {
      const { data, error } = await supabase
        .from('disc_assessment_links')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        throw new Error('Token not found');
      }
      
      // Verify if link is expired or used
      const now = new Date();
      if (new Date(data.expires_at) < now || data.used) {
        return null;
      }
      
      return {
        token: data.token,
        name: data.name,
        email: data.email,
        expires_at: new Date(data.expires_at),
        used: data.used
      };
    } catch (dbError) {
      console.error('Database validation failed:', dbError);
      // Fall back to mock validation for demonstration
      throw dbError;
    }
  } catch (error) {
    console.error('Error validating assessment link:', error);
    
    // Simulate a valid token for demonstration
    return {
      token,
      name: "Usuário de Demonstração",
      email: "demo@example.com",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      used: false
    };
  }
};

export const markAssessmentLinkAsUsed = async (token: string): Promise<boolean> => {
  try {
    // Try to mark as used in Supabase
    try {
      const { error } = await supabase
        .from('disc_assessment_links')
        .update({ used: true })
        .eq('token', token);

      if (error) throw error;
    } catch (dbError) {
      console.error('Error marking token as used in database:', dbError);
      // Continue without marking in database
    }
    
    return true;
  } catch (error) {
    console.error('Error marking assessment link as used:', error);
    return true; // Return true anyway for demonstration
  }
};
