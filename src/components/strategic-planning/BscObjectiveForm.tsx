
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBscObjective, createBscMeasure } from "@/services/strategicPlanningService";
import { addIndicator } from "@/services/indicatorService";
import { useToast } from "@/hooks/use-toast";
import { AuthenticationRequired } from "@/components/auth/AuthenticationRequired";

interface BscObjectiveFormProps {
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  onSaved: () => void;
  onCancel: () => void;
}

const perspectiveLabels = {
  financial: "Financeira",
  customer: "Clientes",
  internal_process: "Processos Internos",
  learning_growth: "Aprendizado e Crescimento"
};

export function BscObjectiveForm({ perspective, onSaved, onCancel }: BscObjectiveFormProps) {
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
        <div className="space-y-2">
          <Label htmlFor="objective-title">Objetivo Estratégico</Label>
          <Input
            id="objective-title"
            placeholder="Digite o título do objetivo estratégico"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="objective-description">Descrição</Label>
          <Textarea
            id="objective-description"
            placeholder="Descreva o objetivo em detalhes..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target-value">Meta</Label>
            <Input
              id="target-value"
              type="number"
              placeholder="Valor da meta"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-unit">Unidade</Label>
            <Input
              id="target-unit"
              placeholder="Ex: %, R$, unidades"
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              required
            />
          </div>
        </div>

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
