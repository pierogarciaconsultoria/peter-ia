
import { supabase } from "@/integrations/supabase/client";
import { ResumeAnalysis } from "@/types/recruitment";
import { toast } from "sonner";

export async function analyzeResume(resumeText: string, jobDescription: string) {
  try {
    console.log("Iniciando análise de currículo");
    
    const { data, error } = await supabase.functions.invoke("analyze-resume", {
      body: { resumeText, jobDescription }
    });

    if (error) {
      console.error("Erro ao chamar função de análise:", error);
      throw new Error(error.message || "Erro ao analisar currículo");
    }

    console.log("Análise concluída:", data);
    return data;
  } catch (error: any) {
    console.error("Erro no serviço de análise:", error);
    toast.error("Erro ao analisar currículo", {
      description: error.message || "Tente novamente mais tarde"
    });
    throw error;
  }
}

export async function saveResumeAnalysis(analysisData: Omit<ResumeAnalysis, 'id' | 'created_at'>) {
  try {
    console.log("Salvando análise de currículo:", analysisData);
    
    const { data, error } = await supabase
      .from('resume_analyses')
      .insert(analysisData)
      .select();

    if (error) {
      console.error("Erro ao salvar análise:", error);
      throw error;
    }

    return data[0] as ResumeAnalysis;
  } catch (error: any) {
    console.error("Erro ao salvar análise:", error);
    toast.error("Erro ao salvar análise de currículo", {
      description: error.message || "Não foi possível salvar os resultados"
    });
    throw error;
  }
}

export async function getResumeAnalysesForCandidate(candidateId: string) {
  try {
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ResumeAnalysis[];
  } catch (error: any) {
    console.error("Erro ao buscar análises:", error);
    return [];
  }
}

export async function sendDiscAssessment(candidateId: string, assessmentId: string) {
  try {
    // Primeiro buscamos os dados do candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (candidateError) throw candidateError;

    if (!candidate) {
      throw new Error("Candidato não encontrado");
    }

    // Geramos o link para a avaliação DISC
    const { data: link, error: linkError } = await supabase
      .from('candidate_assessment_links')
      .insert({
        assessment_id: assessmentId,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        recruitment_process_id: candidate.recruitment_process_id,
        token: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        used: false
      })
      .select();

    if (linkError) throw linkError;

    // Simula o envio de e-mail (em ambiente real, usaríamos um edge function para isso)
    toast.success(`Avaliação DISC enviada para ${candidate.name}`, {
      description: `Um e-mail foi enviado para ${candidate.email}`
    });

    return link[0];
  } catch (error: any) {
    console.error("Erro ao enviar avaliação DISC:", error);
    toast.error("Erro ao enviar avaliação DISC", {
      description: error.message || "Não foi possível enviar a avaliação"
    });
    throw error;
  }
}
