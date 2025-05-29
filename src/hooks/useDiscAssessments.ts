
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DiscScore {
  d: number;
  i: number;
  s: number;
  c: number;
}

export interface DiscAssessment {
  id: string;
  name: string;
  email: string;
  scores: DiscScore;
  primary_type: string;
  date: string;
  invited_by?: string;
  created_at: string;
}

export interface DiscEvaluationLink {
  id: string;
  name: string;
  email: string;
  token: string;
  expires_at: string;
  is_used: boolean;
  entity_type: string;
  entity_id: string;
  company_id: string;
  created_by?: string;
  created_at: string;
}

export const useDiscAssessments = () => {
  const [assessments, setAssessments] = useState<DiscAssessment[]>([]);
  const [evaluationLinks, setEvaluationLinks] = useState<DiscEvaluationLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userCompany } = useAuth();

  const fetchAssessments = useCallback(async () => {
    if (!userCompany?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch DISC assessments
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('disc_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (assessmentError) throw assessmentError;

      // Transform the data to match our interface
      const transformedAssessments: DiscAssessment[] = (assessmentData || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        scores: item.scores as DiscScore,
        primary_type: item.primary_type,
        date: item.date || item.created_at,
        invited_by: item.invited_by,
        created_at: item.created_at
      }));

      // Fetch evaluation links
      const { data: linkData, error: linkError } = await (supabase as any)
        .from('disc_evaluation_links')
        .select('*')
        .eq('company_id', userCompany.id)
        .order('created_at', { ascending: false });

      if (linkError) throw linkError;

      setAssessments(transformedAssessments);
      setEvaluationLinks(linkData || []);
    } catch (error: any) {
      console.error('Error fetching DISC assessments:', error);
      setError(error.message);
      toast.error('Erro ao carregar avaliações DISC');
    } finally {
      setIsLoading(false);
    }
  }, [userCompany?.id]);

  const createEvaluationLink = async (data: {
    name: string;
    email: string;
    entity_type: string;
    entity_id: string;
  }) => {
    if (!userCompany?.id) return;

    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + 7); // 7 days from now

      const { data: linkData, error } = await (supabase as any)
        .from('disc_evaluation_links')
        .insert([{
          ...data,
          token,
          expires_at: expires_at.toISOString(),
          company_id: userCompany.id,
          is_used: false,
        }])
        .select()
        .single();

      if (error) throw error;

      setEvaluationLinks(prev => [linkData, ...prev]);
      toast.success('Link de avaliação criado com sucesso');
      
      return linkData;
    } catch (error: any) {
      console.error('Error creating evaluation link:', error);
      toast.error('Erro ao criar link de avaliação');
      throw error;
    }
  };

  const deleteEvaluationLink = async (linkId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('disc_evaluation_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      setEvaluationLinks(prev => prev.filter(link => link.id !== linkId));
      toast.success('Link de avaliação removido');
    } catch (error: any) {
      console.error('Error deleting evaluation link:', error);
      toast.error('Erro ao remover link de avaliação');
    }
  };

  return {
    assessments,
    evaluationLinks,
    isLoading,
    error,
    fetchAssessments,
    createEvaluationLink,
    deleteEvaluationLink,
  };
};
