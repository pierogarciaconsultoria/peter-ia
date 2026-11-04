import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createCycle, Cycle, CYCLE_TYPE_LABELS, quarterFor } from "@/services/strategic-planning/cycleService";

interface CycleFormProps {
  onSaved: (cycle: Cycle) => void;
  onCancel: () => void;
}

export function CycleForm({ onSaved, onCancel }: CycleFormProps) {
  const { toast } = useToast();
  const suggestion = quarterFor();
  const [name, setName] = useState(suggestion.name);
  const [type, setType] = useState<Cycle['type']>('quarterly');
  const [startDate, setStartDate] = useState(suggestion.start_date);
  const [endDate, setEndDate] = useState(suggestion.end_date);
  const [frequency, setFrequency] = useState("7");
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (value: Cycle['type']) => {
    setType(value);
    if (value === 'annual') {
      const year = new Date().getFullYear();
      setName(`Ano ${year}`);
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
    } else {
      const q = quarterFor();
      setName(q.name);
      setStartDate(q.start_date);
      setEndDate(q.end_date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endDate < startDate) {
      toast({ title: "Data final anterior à inicial", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const cycle = await createCycle({
        name: name.trim(),
        type,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        check_in_frequency_days: Math.max(1, parseInt(frequency, 10) || 7),
      });
      toast({ title: "Ciclo criado", description: cycle.name });
      onSaved(cycle);
    } catch (error) {
      console.error("Error creating cycle:", error);
      toast({ title: "Erro ao criar ciclo", description: "Apenas administradores da empresa criam ciclos", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => handleTypeChange(v as Cycle['type'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(CYCLE_TYPE_LABELS) as Cycle['type'][]).map(t => (
                <SelectItem key={t} value={t}>{CYCLE_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycle-name">Nome</Label>
          <Input id="cycle-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycle-start">Início</Label>
          <Input id="cycle-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycle-end">Fim</Label>
          <Input id="cycle-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycle-frequency">Check-in a cada (dias)</Label>
          <Input id="cycle-frequency" type="number" min={1} max={90} value={frequency} onChange={(e) => setFrequency(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving}>{saving ? "Criando..." : "Criar ciclo"}</Button>
      </DialogFooter>
    </form>
  );
}
