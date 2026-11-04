import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BscObjective } from "@/types/strategic-planning";
import { closeObjective } from "@/services/strategic-planning/bscService";

interface CloseObjectiveDialogProps {
  objective: BscObjective | null;
  onClose: () => void;
  onSaved: () => void;
}

/** Fechamento do objetivo no fim do ciclo: nota (0 a 1) e aprendizados. */
export function CloseObjectiveDialog({ objective, onClose, onSaved }: CloseObjectiveDialogProps) {
  const { toast } = useToast();
  const suggested = objective?.progress ?? 0;
  const [score, setScore] = useState<number>(Math.round(suggested * 10) / 10);
  const [learnings, setLearnings] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective) return;
    setSaving(true);
    try {
      await closeObjective(objective.id, { score, learnings: learnings.trim() });
      toast({ title: "Objetivo encerrado", description: `Nota ${Math.round(score * 100)}%` });
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error closing objective:", error);
      toast({ title: "Erro ao encerrar objetivo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={objective !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[520px]">
        {objective && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Encerrar objetivo</DialogTitle>
              <DialogDescription>{objective.title}</DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Nota do objetivo</Label>
                <span className="text-sm font-medium">{Math.round(score * 100)}%</span>
              </div>
              <Slider min={0} max={1} step={0.1} value={[score]} onValueChange={(v) => setScore(v[0])} />
              <p className="text-xs text-muted-foreground">
                Sugestão a partir do progresso dos resultados-chave: {Math.round(suggested * 100)}%. Entre 60% e 70% já é um bom resultado para metas ambiciosas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learnings">Aprendizados</Label>
              <Textarea
                id="learnings"
                rows={4}
                placeholder="O que funcionou, o que não funcionou e o que muda no próximo ciclo"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Encerrando..." : "Encerrar objetivo"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
