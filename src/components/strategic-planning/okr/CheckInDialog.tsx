import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  CheckIn,
  CheckInConfidence,
  CheckInEntityType,
  CONFIDENCE_LABELS,
  createCheckIn,
  getCheckIns,
} from "@/services/strategic-planning/checkInService";

export interface CheckInTarget {
  entity_type: CheckInEntityType;
  entity_id: string;
  name: string;
  unit: string;
  target: number;
  current_value: number | null;
  /** Para KPI: mês/ano da medição (padrão: mês atual) */
  month?: number;
  year?: number;
}

interface CheckInDialogProps {
  target: CheckInTarget | null;
  onClose: () => void;
  onSaved: () => void;
}

const CONFIDENCE_STYLES: Record<CheckInConfidence, string> = {
  on_track: "border-green-500 bg-green-50 text-green-800 data-[active=true]:bg-green-500 data-[active=true]:text-white",
  at_risk: "border-yellow-500 bg-yellow-50 text-yellow-800 data-[active=true]:bg-yellow-500 data-[active=true]:text-white",
  off_track: "border-red-500 bg-red-50 text-red-800 data-[active=true]:bg-red-500 data-[active=true]:text-white",
};

export const CONFIDENCE_BADGE: Record<CheckInConfidence, string> = {
  on_track: "bg-green-100 text-green-800",
  at_risk: "bg-yellow-100 text-yellow-800",
  off_track: "bg-red-100 text-red-800",
};

export function CheckInDialog({ target, onClose, onSaved }: CheckInDialogProps) {
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [confidence, setConfidence] = useState<CheckInConfidence>("on_track");
  const [comment, setComment] = useState("");
  const [history, setHistory] = useState<CheckIn[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!target) return;
    setValue(target.current_value !== null && target.current_value !== undefined ? String(target.current_value) : "");
    setConfidence("on_track");
    setComment("");
    getCheckIns(target.entity_type, target.entity_id).then(setHistory).catch(() => setHistory([]));
  }, [target]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    const numeric = parseFloat(value);
    if (!Number.isFinite(numeric)) {
      toast({ title: "Informe um valor numérico", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await createCheckIn({
        entity_type: target.entity_type,
        entity_id: target.entity_id,
        value: numeric,
        confidence,
        comment,
        month: target.month,
        year: target.year,
      });
      toast({ title: "Check-in registrado", description: `${target.name}: ${numeric} ${target.unit}` });
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving check-in:", error);
      toast({ title: "Erro ao registrar check-in", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[520px]">
        {target && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Check-in: {target.name}</DialogTitle>
              <DialogDescription>
                Meta {target.target} {target.unit}
                {target.entity_type === "kpi" && target.month && target.year ? ` · ${String(target.month).padStart(2, "0")}/${target.year}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="checkin-value">Valor atual ({target.unit || "un"})</Label>
              <Input
                id="checkin-value"
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Confiança</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CONFIDENCE_LABELS) as CheckInConfidence[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    data-active={confidence === key}
                    onClick={() => setConfidence(key)}
                    className={cn("rounded-md border px-3 py-2 text-sm font-medium transition-colors", CONFIDENCE_STYLES[key])}
                  >
                    {CONFIDENCE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkin-comment">Comentário</Label>
              <Textarea
                id="checkin-comment"
                rows={3}
                placeholder="O que avançou, o que travou, próximos passos"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {history.length > 0 && (
              <div className="space-y-2">
                <Label>Histórico</Label>
                <div className="max-h-40 overflow-y-auto divide-y rounded-md border text-sm">
                  {history.map((item) => (
                    <div key={item.id} className="p-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-medium">{item.value} {target.unit}</span>
                        {item.comment && <p className="text-xs text-muted-foreground truncate">{item.comment}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <Badge className={CONFIDENCE_BADGE[item.confidence]} variant="outline">
                          {CONFIDENCE_LABELS[item.confidence]}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Registrar check-in"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
