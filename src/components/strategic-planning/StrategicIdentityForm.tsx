import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PenLine, Save, RotateCcw, Sparkles } from "lucide-react";
import { StrategicIdentity } from "@/types/strategic-planning";
import { updateStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { useToast } from "@/hooks/use-toast";
import { ManualIdentityForm } from "./ManualIdentityForm";
import { IdentityFormActions } from "./IdentityFormActions";
import { Button } from "../ui/button";
import { IdentitySuggestionDialog } from "./IdentitySuggestionDialog";
import { IndicatorSuggestionDialog } from "./IndicatorSuggestionDialog";
import { useIndicators } from "@/hooks/useIndicators";
import { IndicatorType } from "@/types/indicators";

interface StrategicIdentityFormProps {
  identity: StrategicIdentity | null;
  onUpdate: () => void;
}

export function StrategicIdentityForm({ identity, onUpdate }: StrategicIdentityFormProps) {
  const { toast } = useToast();
  
  const [mission, setMission] = useState(identity?.mission || "");
  const [vision, setVision] = useState(identity?.vision || "");
  const [values, setValues] = useState<string[]>(identity?.values || []);
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showIndicatorSuggestions, setShowIndicatorSuggestions] = useState(false);

  const { addIndicator } = useIndicators();

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

  const enableEditing = () => {
    setIsEditing(true);
  };

  const handleApplySuggestions = (suggestions: Pick<StrategicIdentity, "mission" | "vision" | "values">) => {
    setMission(suggestions.mission);
    setVision(suggestions.vision);
    setValues(suggestions.values);
    
    toast({
      title: "Sugestões Aplicadas",
      description: "As sugestões de IA foram aplicadas ao formulário",
    });
  };

  const hasIdentityData = mission.trim() !== "" && vision.trim() !== "" && values.length > 0;

  const createIndicator = async (name: string) => {
    const indicatorData: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'> = {
      name,
      description: `Indicador estratégico para ${name}`,
      process: "Estratégico",
      goal_type: "higher_better",
      goal_value: 100,
      calculation_type: "average",
      unit: "%"
    };

    await addIndicator(indicatorData);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Identidade Estratégica</CardTitle>
            <CardDescription>
              Defina a missão, visão e valores da sua organização
            </CardDescription>
          </div>
          
          {isEditing && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowAiSuggestions(true)}
            >
              <Sparkles className="h-4 w-4" />
              Sugestões de IA
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ManualIdentityForm
            mission={mission}
            setMission={setMission}
            vision={vision}
            setVision={setVision}
            values={values}
            setValues={setValues}
            isLoading={loading}
            isEditable={isEditing}
          />
          
          {isEditing ? (
            <IdentityFormActions 
              onReset={resetForm}
              isLoading={loading}
            />
          ) : (
            <div className="flex justify-end gap-3 mt-4">
              {hasIdentityData && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowIndicatorSuggestions(true)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Sugerir Indicadores
                </Button>
              )}
              <Button 
                type="button" 
                onClick={enableEditing}
                className="flex items-center gap-2"
              >
                <PenLine className="h-4 w-4" />
                Editar
              </Button>
            </div>
          )}
        </form>
      </CardContent>

      <IdentitySuggestionDialog
        open={showAiSuggestions}
        onClose={() => setShowAiSuggestions(false)}
        onAccept={handleApplySuggestions}
      />

      {hasIdentityData && (
        <IndicatorSuggestionDialog
          open={showIndicatorSuggestions}
          onClose={() => setShowIndicatorSuggestions(false)}
          identity={{
            mission,
            vision,
            values
          }}
        />
      )}
    </Card>
  );
}
