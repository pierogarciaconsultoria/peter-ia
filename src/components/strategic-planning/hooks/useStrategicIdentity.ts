
import { useState } from "react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { useToast } from "@/hooks/use-toast";
import { useIndicators } from "@/hooks/useIndicators";
import { IndicatorType } from "@/types/indicators";

export const useStrategicIdentity = (
  identity: StrategicIdentity | null,
  onUpdate: () => void
) => {
  const { toast } = useToast();
  const { addIndicator } = useIndicators();
  
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showIndicatorSuggestions, setShowIndicatorSuggestions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateStrategicIdentity({
        mission,
        vision,
        values,
      });
      
      const hasIdentityData = mission.trim() !== "" && vision.trim() !== "" && values.length > 0;
      if (hasIdentityData) {
        const strategicIndicators: Array<Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'>> = [
          {
            name: "Cumprimento da Missão",
            description: `Avaliação do cumprimento da missão: ${mission}`,
            process: "Estratégico",
            goal_type: "higher_better",
            goal_value: 100,
            calculation_type: "average",
            unit: "%"
          },
          {
            name: "Alcance da Visão",
            description: `Progresso em direção à visão: ${vision}`,
            process: "Estratégico",
            goal_type: "higher_better",
            goal_value: 100,
            calculation_type: "average",
            unit: "%"
          },
          ...values.map(value => ({
            name: `Aderência ao Valor: ${value}`,
            description: `Avaliação da aderência ao valor organizacional: ${value}`,
            process: "Estratégico",
            goal_type: "higher_better" as const,
            goal_value: 100,
            calculation_type: "average" as const,
            unit: "%"
          }))
        ];

        await Promise.all(strategicIndicators.map(indicator => addIndicator(indicator)));
      }
      
      toast({
        title: "Identidade Estratégica Atualizada",
        description: "As informações foram salvas com sucesso",
      });
      
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving strategic identity:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as informações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMission(identity?.mission || "");
    setVision(identity?.vision || "");
    setValues(identity?.values || []);
    
    toast({
      title: "Formulário Redefinido",
      description: "Os campos foram restaurados para os valores salvos anteriormente",
    });
  };

  return {
    mission,
    setMission,
    vision,
    setVision,
    values,
    setValues,
    loading,
    isEditing,
    setIsEditing,
    showAiSuggestions,
    setShowAiSuggestions,
    showIndicatorSuggestions,
    setShowIndicatorSuggestions,
    handleSubmit,
    resetForm,
  };
};
