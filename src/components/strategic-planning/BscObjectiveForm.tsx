
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBscObjective, createBscMeasure } from "@/services/strategicPlanningService";
import { addIndicator } from "@/services/indicatorService";
import { useToast } from "@/hooks/use-toast";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";
import { BasicInfoSection } from "./bsc-form/BasicInfoSection";
import { TargetSection } from "./bsc-form/TargetSection";
import { BscFormProps } from "@/types/bsc-form";

const perspectiveLabels = {
  financial: "Financeira",
  customer: "Clientes",
  internal_process: "Processos Internos",
  learning_growth: "Aprendizado e Crescimento"
};

export function BscObjectiveForm({ perspective, onSaved, onCancel }: BscFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetUnit, setTargetUnit] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create BSC objective
      const objective = await createBscObjective({
        perspective_id: perspective,
        title,
        description
      });
      
      if (objective) {
        // Create BSC measure
        await createBscMeasure({
          objective_id: objective.id,
          name: title,
          target: parseFloat(targetValue) || 0,
          unit: targetUnit
        });

        // Create corresponding performance indicator
        await addIndicator({
          name: title,
          description: description,
          process: "Estratégico",
          goal_type: "higher_better",
          goal_value: parseFloat(targetValue) || 0,
          calculation_type: "average",
          unit: targetUnit
        });

        toast({
          title: "Objetivo criado",
          description: "O objetivo foi adicionado com sucesso",
        });
        
        onSaved();
      }
    } catch (error) {
      console.error("Error creating BSC objective:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao criar o objetivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticationRequired>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <BasicInfoSection
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />
        
        <TargetSection
          targetValue={targetValue}
          targetUnit={targetUnit}
          onTargetValueChange={setTargetValue}
          onTargetUnitChange={setTargetUnit}
        />

        <div className="space-y-2">
          <Label>Perspectiva</Label>
          <div className="px-4 py-3 rounded-md bg-muted">
            {perspectiveLabels[perspective]}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar Objetivo"}
          </Button>
        </div>
      </form>
    </AuthenticationRequired>
  );
}
