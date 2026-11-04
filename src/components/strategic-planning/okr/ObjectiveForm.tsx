import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BSC_PERSPECTIVE_LABELS, BSC_PERSPECTIVES, BscObjective, BscPerspectiveKey } from "@/types/strategic-planning";
import { createObjective, updateObjective } from "@/services/strategic-planning/bscService";
import { Cycle } from "@/services/strategic-planning/cycleService";
import { StrategyPillar } from "@/services/strategic-planning/strategyService";
import { OwnerSelect } from "./OwnerSelect";

const NONE = "__none__";

interface ObjectiveFormProps {
  objective?: BscObjective;
  cycles: Cycle[];
  defaultCycleId: string;
  pillars: StrategyPillar[];
  /** Objetivos candidatos a "pai" (cascata empresa -> área) */
  parentCandidates: BscObjective[];
  onSaved: () => void;
  onCancel: () => void;
}

/** Formulário de objetivo. Sem campo de meta: quem mede é o resultado-chave. */
export function ObjectiveForm({ objective, cycles, defaultCycleId, pillars, parentCandidates, onSaved, onCancel }: ObjectiveFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(objective?.title ?? "");
  const [description, setDescription] = useState(objective?.description ?? "");
  const [cycleId, setCycleId] = useState(objective?.cycle_id ?? defaultCycleId);
  const [pillarId, setPillarId] = useState<string | null>(objective?.pillar_id ?? null);
  const [ownerId, setOwnerId] = useState<string | null>(objective?.owner_id ?? null);
  const [parentId, setParentId] = useState<string | null>(objective?.parent_objective_id ?? null);
  const [perspective, setPerspective] = useState<BscPerspectiveKey | null>(objective?.perspective ?? null);
  const [saving, setSaving] = useState(false);

  const handlePillarChange = (value: string) => {
    const id = value === NONE ? null : value;
    setPillarId(id);
    // Herda a perspectiva BSC do pilar, se houver
    const pillar = pillars.find(p => p.id === id);
    if (pillar?.bsc_perspective) setPerspective(pillar.bsc_perspective);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        cycle_id: cycleId,
        pillar_id: pillarId,
        owner_id: ownerId,
        parent_objective_id: parentId,
        perspective,
      };
      if (objective) {
        await updateObjective(objective.id, payload);
        toast({ title: "Objetivo atualizado" });
      } else {
        await createObjective(payload);
        toast({ title: "Objetivo criado", description: "Agora adicione os resultados-chave que vão medir este objetivo." });
      }
      onSaved();
    } catch (error) {
      console.error("Error saving objective:", error);
      toast({ title: "Erro ao salvar objetivo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="objective-title">Objetivo</Label>
        <Input
          id="objective-title"
          placeholder="Ex: Tornar a entrega de projetos previsível"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={160}
        />
        <p className="text-xs text-muted-foreground">
          Descreva uma mudança qualitativa. A medição fica nos resultados-chave.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective-description">Descrição</Label>
        <Textarea
          id="objective-description"
          rows={2}
          placeholder="Por que este objetivo importa agora"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ciclo</Label>
          <Select value={cycleId} onValueChange={setCycleId}>
            <SelectTrigger><SelectValue placeholder="Selecione o ciclo" /></SelectTrigger>
            <SelectContent>
              {cycles.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Responsável</Label>
          <OwnerSelect value={ownerId} onChange={setOwnerId} />
        </div>

        <div className="space-y-2">
          <Label>Pilar estratégico</Label>
          <Select value={pillarId ?? NONE} onValueChange={handlePillarChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Sem pilar</SelectItem>
              {pillars.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Perspectiva BSC (opcional)</Label>
          <Select value={perspective ?? NONE} onValueChange={(v) => setPerspective(v === NONE ? null : (v as BscPerspectiveKey))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Nenhuma</SelectItem>
              {BSC_PERSPECTIVES.map(p => (
                <SelectItem key={p} value={p}>{BSC_PERSPECTIVE_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {parentCandidates.length > 0 && (
        <div className="space-y-2">
          <Label>Desdobra o objetivo (opcional)</Label>
          <Select value={parentId ?? NONE} onValueChange={(v) => setParentId(v === NONE ? null : v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Nenhum (objetivo da empresa)</SelectItem>
              {parentCandidates.filter(p => p.id !== objective?.id).map(p => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving || !cycleId}>{saving ? "Salvando..." : objective ? "Salvar" : "Criar objetivo"}</Button>
      </DialogFooter>
    </form>
  );
}
