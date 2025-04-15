
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBscObjective } from "@/services/strategicPlanningService";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSelector } from "@/components/hr/shared/EmployeeSelector";

interface BscObjectiveFormProps {
  perspective: 'financial' | 'customer' | 'internal_process' | 'learning_growth';
  onSaved: () => void;
  onCancel: () => void;
}

export function BscObjectiveForm({ perspective, onSaved, onCancel }: BscObjectiveFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetUnit, setTargetUnit] = useState("");
  const [measurementFrequency, setMeasurementFrequency] = useState("monthly");
  const [responsibleId, setResponsibleId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createBscObjective({
        perspective_id: perspective,
        title,
        description,
        target_value: parseFloat(targetValue),
        target_unit: targetUnit,
        measurement_frequency: measurementFrequency,
        responsible_id: responsibleId
      });
      
      toast({
        title: "Objetivo criado",
        description: "O objetivo foi adicionado com sucesso",
      });
      
      onSaved();
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="objective-title">Título do Objetivo</Label>
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
        <Label htmlFor="measurement-frequency">Frequência de Medição</Label>
        <Select value={measurementFrequency} onValueChange={setMeasurementFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diária</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Responsável</Label>
        <EmployeeSelector
          employeeId={responsibleId}
          setEmployeeId={setResponsibleId}
          placeholder="Selecione o responsável"
          required
        />
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
  );
}
