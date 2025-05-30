
import { useState, useEffect } from "react";
import { ExitInterview } from "@/types/exitInterviews";
import { ExitInterviewService } from "@/services/exitInterviewService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useExitInterviews() {
  const [exitInterviews, setExitInterviews] = useState<ExitInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>("");
  const { toast } = useToast();

  const loadExitInterviews = async () => {
    try {
      setIsLoading(true);
      
      // Get user's company ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', userData.user.id)
        .single();

      if (!profileData?.company_id) return;
      
      setCompanyId(profileData.company_id);

      // Fetch exit interviews
      const interviews = await ExitInterviewService.getExitInterviews(profileData.company_id);
      setExitInterviews(interviews);
      
    } catch (error) {
      console.error("Error loading exit interviews:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entrevistas de desligamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createExitInterview = async (data: any) => {
    try {
      await ExitInterviewService.createExitInterview({
        ...data,
        company_id: companyId
      });
      await loadExitInterviews();
      toast({
        title: "Sucesso",
        description: "Entrevista de desligamento criada com sucesso.",
      });
    } catch (error) {
      console.error("Error creating exit interview:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a entrevista de desligamento.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markAsSent = async (id: string, messageId?: string) => {
    try {
      await ExitInterviewService.markAsSent(id, messageId);
      await loadExitInterviews();
      toast({
        title: "Sucesso",
        description: "Entrevista marcada como enviada.",
      });
    } catch (error) {
      console.error("Error marking as sent:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const deleteExitInterview = async (id: string) => {
    try {
      await ExitInterviewService.deleteExitInterview(id);
      await loadExitInterviews();
      toast({
        title: "Sucesso",
        description: "Entrevista removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting exit interview:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a entrevista.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadExitInterviews();
  }, []);

  return {
    exitInterviews,
    isLoading,
    companyId,
    loadExitInterviews,
    createExitInterview,
    markAsSent,
    deleteExitInterview
  };
}
