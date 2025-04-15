
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClimateSurveyList } from "./ClimateSurveyList";
import { SurveyEditor } from "./SurveyEditor";
import { SurveyResponseForm } from "./SurveyResponseForm";
import { SurveyResults } from "./SurveyResults";
import { useClimateSurveys } from "@/hooks/useClimateSurveys";
import { submitSurveyResponse } from "@/services/climateSurveyService";
import { toast } from "sonner";

export function ClimateSurvey() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentSurvey, questions, fetchSurveyWithQuestions } = useClimateSurveys();
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // Extrair parâmetros da URL
  const searchParams = new URLSearchParams(location.search);
  const surveyId = searchParams.get("survey");
  const view = searchParams.get("view"); // 'preview' ou 'results'
  
  // Carregar pesquisa específica se houver ID na URL
  useEffect(() => {
    const loadSurvey = async () => {
      if (surveyId) {
        setIsLoading(true);
        try {
          await fetchSurveyWithQuestions(surveyId);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadSurvey();
  }, [surveyId, fetchSurveyWithQuestions]);
  
  // Lidar com o envio de uma resposta
  const handleSubmitResponse = async (responses: any) => {
    if (!surveyId || !currentSurvey) return;
    
    try {
      await submitSurveyResponse({
        survey_id: surveyId,
        is_anonymous: true,
        responses,
        company_id: "1" // Isso deve ser definido dinamicamente de acordo com o usuário logado
      });
      
      setSubmitted(true);
      toast.success("Resposta enviada com sucesso", {
        description: "Obrigado por participar da pesquisa de clima!"
      });
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta", {
        description: "Tente novamente mais tarde."
      });
    }
  };
  
  // Renderizar componente de acordo com o estado atual
  if (surveyId) {
    // Página de resposta (modo de visualização)
    if (view === "preview") {
      if (submitted) {
        // Exibir agradecimento após envio
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Obrigado por sua participação!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Sua resposta foi registrada com sucesso. Suas opiniões são muito importantes para melhorarmos nosso ambiente de trabalho.
              </p>
              <button
                onClick={() => navigate("/human-resources?activeTab=climate")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4"
              >
                Voltar para pesquisas
              </button>
            </div>
          </div>
        );
      }
      
      // Exibir formulário de resposta
      return (
        <SurveyResponseForm
          surveyId={surveyId}
          title={currentSurvey?.title || ""}
          description={currentSurvey?.description || ""}
          questions={questions}
          onSubmit={handleSubmitResponse}
          isLoading={isLoading}
        />
      );
    }
    
    // Página de resultados
    if (view === "results") {
      return (
        <SurveyResults
          surveyId={surveyId}
          title={currentSurvey?.title || ""}
          questions={questions}
        />
      );
    }
    
    // Página de edição
    return <SurveyEditor surveyId={surveyId} />;
  }
  
  // Lista de pesquisas (página inicial)
  return <ClimateSurveyList />;
}
