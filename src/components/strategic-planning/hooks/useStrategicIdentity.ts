import { useEffect, useState } from "react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { useToast } from "@/hooks/use-toast";

export const useStrategicIdentity = (
  identity: StrategicIdentity | null,
  onUpdate: () => void
) => {
  const { toast } = useToast();
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!identity);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showIndicatorSuggestions, setShowIndicatorSuggestions] = useState(false);

  // Sincroniza o formulário quando a identidade chega do banco (ou é aplicada pela IA)
  useEffect(() => {
    setMission(identity?.mission || "");
    setVision(identity?.vision || "");
    setValues(identity?.values || []);
    setIsEditing(!identity);
  }, [identity?.id, identity?.updated_at]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateStrategicIdentity({ mission, vision, values, source: 'manual' });

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
