
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBscMeasure } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";

interface BscMeasureFormProps {
  objectiveId: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function BscMeasureForm({ objectiveId, onSaved, onCancel }: BscMeasureFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [unit, setUnit] = useState("");
  const [currentValue, setCurrentValue] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createBscMeasure({
        objective_id: objectiveId,
        name,
        target,
        unit,
        current_value: currentValue
      });
      
      toast({
        title: "Indicador criado",
        description: "O indicador foi adicionado com sucesso",
      });
      
      onSaved();
    } catch (error) {
      console.error("Error creating BSC measure:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao criar o indicador",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="measure-name">Nome do Indicador</Label>
        <Input
          id="measure-name"
          placeholder="Ex: Taxa de Retenção de Clientes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="measure-target">Meta</Label>
          <Input
            id="measure-target"
            type="number"
            placeholder="Ex: 95"
            value={target.toString()}
            onChange={(e) => setTarget(parseFloat(e.target.value))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="measure-unit">Unidade</Label>
          <Input
            id="measure-unit"
            placeholder="Ex: %"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="measure-current">
          Valor Atual <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <Input
          id="measure-current"
          type="number"
          placeholder="Deixe vazio se não disponível"
          value={currentValue !== undefined ? currentValue.toString() : ""}
          onChange={(e) => setCurrentValue(e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar Indicador"}
        </Button>
      </div>
    </form>
  );
}
