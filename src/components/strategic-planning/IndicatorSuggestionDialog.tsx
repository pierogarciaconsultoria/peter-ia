
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityQuestionnaire } from "./questionnaire/IdentityQuestionnaire";
import { StrategicIdentity } from "@/types/strategic-planning";
import { Check, FileEdit, ThumbsDown, ThumbsUp } from "lucide-react";
import { addIndicator } from "@/services/indicatorService";

interface IndicatorSuggestionDialogProps {
  open: boolean;
  onClose: () => void;
  identity: Pick<StrategicIdentity, "mission" | "vision" | "values">;
}

export function IndicatorSuggestionDialog({
  open,
  onClose,
  identity
}: IndicatorSuggestionDialogProps) {
  const [suggestedIndicators, setSuggestedIndicators] = useState<string[]>([]);

  const handleGenerateSuggestions = async () => {
    const { mission, vision, values } = identity;
    const suggestions: string[] = [];

    if (mission) {
      suggestions.push(`Cumprimento da Missão: ${mission.substring(0, 50)}...`);
    }
    if (vision) {
      suggestions.push(`Alcance da Visão: ${vision.substring(0, 50)}...`);
    }
    values.forEach(value => {
      suggestions.push(`Aderência ao Valor: ${value}`);
    });

    setSuggestedIndicators(suggestions);
  };

  const handleCreateIndicators = async () => {
    await Promise.all(suggestedIndicators.map(indicatorName => {
      return addIndicator({
        name: indicatorName,
        description: `Indicador estratégico para ${indicatorName}`,
        process: "Estratégico",
        goal_type: "higher_better",
        goal_value: 100,
        calculation_type: "average",
        unit: "%"
      });
    }));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-medium mb-4">
          Sugerir Indicadores Estratégicos
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Com base na identidade estratégica da sua organização, podemos sugerir
          indicadores relevantes para monitorar o progresso.
        </p>

        {!suggestedIndicators.length ? (
          <div className="flex justify-center">
            <Button onClick={handleGenerateSuggestions}>
              Gerar Sugestões
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-md font-medium">Indicadores Sugeridos:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {suggestedIndicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleCreateIndicators}>
                Criar Indicadores
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
