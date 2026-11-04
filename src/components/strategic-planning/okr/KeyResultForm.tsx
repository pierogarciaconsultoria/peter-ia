import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BscMeasure } from "@/types/strategic-planning";
import { IndicatorType } from "@/types/indicators";
import { getAllIndicators } from "@/services/indicatorService";
import { createKeyResult, createMeasureWithIndicator, MAX_KEY_RESULTS, updateKeyResult } from "@/services/strategic-planning/bscService";
import { OwnerSelect } from "./OwnerSelect";

const NEW_INDICATOR = "__new__";
const NO_INDICATOR = "__none__";

interface KeyResultFormProps {
  objectiveId: string;
  objectiveTitle: string;
  existingCount: number;
  keyResult?: BscMeasure;
  onSaved: () => void;
  onCancel: () => void;
}

/** Resultado-chave: valor inicial, meta, valor atual e unidade. Progresso é calculado. */
export function KeyResultForm({ objectiveId, objectiveTitle, existingCount, keyResult, onSaved, onCancel }: KeyResultFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(keyResult?.name ?? "");
  const [startValue, setStartValue] = useState(keyResult ? String(keyResult.start_value) : "0");
  const [target, setTarget] = useState(keyResult ? String(keyResult.target) : "");
  const [currentValue, setCurrentValue] = useState(keyResult?.current_value != null ? String(keyResult.current_value) : "");
  const [unit, setUnit] = useState(keyResult?.unit ?? "");
  const [ownerId, setOwnerId] = useState<string | null>(keyResult?.owner_id ?? null);
  const [indicatorChoice, setIndicatorChoice] = useState<string>(keyResult?.indicator_id ?? NO_INDICATOR);
  const [indicators, setIndicators] = useState<IndicatorType[]>([]);
  const [saving, setSaving] = useState(false);

  const limitReached = !keyResult && existingCount >= MAX_KEY_RESULTS;

  useEffect(() => {
    getAllIndicators().then(setIndicators).catch(() => setIndicators([]));
  }, []);

  const handleIndicatorChange = (value: string) => {
    setIndicatorChoice(value);
    const indicator = indicators.find(i => i.id === value);
    if (indicator) {
      if (!name) setName(indicator.name);
      setTarget(String(indicator.goal_value));
      setUnit(indicator.unit || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseFloat(startValue);
    const goal = parseFloat(target);
    if (!Number.isFinite(start) || !Number.isFinite(goal)) {
      toast({ title: "Informe valor inicial e meta numéricos", variant: "destructive" });
      return;
    }
    if (start === goal) {
      toast({ title: "Meta igual ao valor inicial", description: "Sem variação não há progresso a medir.", variant: "destructive" });
      return;
    }
    const current = currentValue.trim() === "" ? null : parseFloat(currentValue);

    setSaving(true);
    try {
      if (keyResult) {
        await updateKeyResult(keyResult.id, {
          name: name.trim(),
          start_value: start,
          target: goal,
          current_value: current,
          unit: unit.trim(),
          owner_id: ownerId,
          indicator_id: indicatorChoice === NO_INDICATOR || indicatorChoice === NEW_INDICATOR ? null : indicatorChoice,
        });
        toast({ title: "Resultado-chave atualizado" });
      } else if (indicatorChoice === NEW_INDICATOR) {
        await createMeasureWithIndicator({
          objective_id: objectiveId,
          name: name.trim(),
          start_value: start,
          target: goal,
          unit: unit.trim(),
          owner_id: ownerId,
          description: `Resultado-chave do objetivo "${objectiveTitle}"`,
        });
        toast({ title: "Resultado-chave e KPI criados" });
      } else {
        await createKeyResult({
          objective_id: objectiveId,
          name: name.trim(),
          start_value: start,
          target: goal,
          current_value: current,
          unit: unit.trim(),
          owner_id: ownerId,
          indicator_id: indicatorChoice === NO_INDICATOR ? null : indicatorChoice,
        });
        toast({ title: "Resultado-chave criado" });
      }
      onSaved();
    } catch (error) {
      console.error("Error saving key result:", error);
      const message = error instanceof Error ? error.message : "";
      toast({
        title: "Erro ao salvar resultado-chave",
        description: message.includes("máximo") ? `Um objetivo aceita no máximo ${MAX_KEY_RESULTS} resultados-chave` : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {limitReached && (
        <p className="rounded-md bg-yellow-50 text-yellow-800 text-sm p-3">
          Este objetivo já tem {MAX_KEY_RESULTS} resultados-chave. A metodologia recomenda no máximo 5: encerre ou remova um antes de adicionar outro.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="kr-name">Resultado-chave</Label>
        <Input
          id="kr-name"
          placeholder="Ex: Reduzir a taxa de retrabalho"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={160}
        />
        <p className="text-xs text-muted-foreground">Deve ser um resultado (outcome). Tarefas vão em iniciativas.</p>
      </div>

      {!keyResult && (
        <div className="space-y-2">
          <Label>KPI vinculado</Label>
          <Select value={indicatorChoice} onValueChange={handleIndicatorChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_INDICATOR}>Sem KPI (valor atualizado por check-in)</SelectItem>
              <SelectItem value={NEW_INDICATOR}>Criar KPI novo com o mesmo nome</SelectItem>
              {indicators.map(i => (
                <SelectItem key={i.id} value={i.id}>{i.name} ({i.process})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Com KPI vinculado, o check-in do KPI também atualiza este resultado-chave.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="kr-start">Valor inicial</Label>
          <Input id="kr-start" type="number" step="any" value={startValue} onChange={(e) => setStartValue(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kr-target">Meta</Label>
          <Input id="kr-target" type="number" step="any" value={target} onChange={(e) => setTarget(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kr-unit">Unidade</Label>
          <Input id="kr-unit" placeholder="%, R$, un" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="kr-current">Valor atual <span className="text-xs text-muted-foreground">(opcional)</span></Label>
          <Input id="kr-current" type="number" step="any" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Vazio = valor inicial" />
        </div>
        <div className="space-y-2">
          <Label>Responsável</Label>
          <OwnerSelect value={ownerId} onChange={setOwnerId} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving || limitReached}>{saving ? "Salvando..." : keyResult ? "Salvar" : "Adicionar"}</Button>
      </DialogFooter>
    </form>
  );
}
