
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

interface CompanyAnalysis {
  id: string;
  analysis_type: string;
  ai_suggestions: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useCompanyAnalysis() {
  const { empresaId } = useCurrentUser();
  const [analyses, setAnalyses] = useState<CompanyAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalyses = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_analysis')
        .select('*')
        .eq('company_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestAnalysis = () => {
    return analyses.length > 0 ? analyses[0] : null;
  };

  const hasAnalysis = () => {
    return analyses.length > 0;
  };

  useEffect(() => {
    fetchAnalyses();
  }, [empresaId]);

  return {
    analyses,
    loading,
    error,
    refetch: fetchAnalyses,
    getLatestAnalysis,
    hasAnalysis
  };
}
