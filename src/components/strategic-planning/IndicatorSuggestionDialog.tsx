import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StrategicIdentity } from "@/types/strategic-planning";
import { IndicatorType } from "@/types/indicators";
import { LoaderCircle, Sparkles } from "lucide-react";
import { addIndicator } from "@/services/indicatorService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IndicatorSuggestionDialogProps {
  open: boolean;
  onClose: () => void;
  identity: Pick<StrategicIdentity, "mission" | "vision" | "values">;
}

type SuggestedIndicator = Omit<IndicatorType, "id" | "created_at" | "updated_at">;

const GOAL_TYPES: IndicatorType["goal_type"][] = ["higher_better", "lower_better", "target"];
const CALC_TYPES: IndicatorType["calculation_type"][] = ["sum", "average"];

function normalizeSuggestion(raw: any): SuggestedIndicator | null {
  const name = raw?.name || raw?.title;
  if (!name) return null;
  return {
    name,
    description: raw.description || `Indicador estratégico: ${name}`,
    process: raw.process || "Estratégico",
    goal_type: GOAL_TYPES.includes(raw.goal_type) ? raw.goal_type : "higher_better",
    goal_value: Number(raw.goal_value ?? raw.target ?? 100) || 100,
    calculation_type: CALC_TYPES.includes(raw.calculation_type) ? raw.calculation_type : "average",
    unit: raw.unit || "%",
  };
}

export function IndicatorSuggestionDialog({ open, onClose, identity }: IndicatorSuggestionDialogProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SuggestedIndicator[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleGenerateSuggestions = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-strategic-indicators", {
        body: { identity },
      });
      if (error) throw error;

      const list = (data?.indicators || [])
        .map(normalizeSuggestion)
        .filter((s: SuggestedIndicator | null): s is SuggestedIndicator => s !== null);

      if (list.length === 0) throw new Error("A IA não retornou indicadores");

      setSuggestions(list);
      setSelected(new Set(list.map((_: SuggestedIndicator, i: number) => i)));
    } catch (error: any) {
      console.error("Error generating indicator suggestions:", error);
      toast({
        title: "Erro ao gerar sugestões",
        description: error?.message || "Tente novamente em instantes",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggle = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const handleCreateIndicators = async () => {
    setCreating(true);
    try {
      const chosen = suggestions.filter((_, i) => selected.has(i));
      await Promise.all(chosen.map(indicator => addIndicator(indicator)));
      toast({
        title: "Indicadores criados",
        description: `${chosen.length} indicador(es) adicionado(s) ao módulo de Indicadores`,
      });
      setSuggestions([]);
      onClose();
    } catch (error) {
      console.error("Error creating indicators:", error);
      toast({ title: "Erro ao criar indicadores", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Sugerir Indicadores Estratégicos
          </DialogTitle>
          <DialogDescription>
            A IA analisa missão, visão e valores e propõe KPIs com meta e unidade.
            Selecione os que deseja criar no módulo de Indicadores.
          </DialogDescription>
        </DialogHeader>

        {suggestions.length === 0 ? (
          <div className="flex justify-center py-4">
            <Button onClick={handleGenerateSuggestions} disabled={generating}>
              {generating ? (
                <><LoaderCircle className="h-4 w-4 mr-2 animate-spin" /> Gerando...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Gerar Sugestões com IA</>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {suggestions.map((indicator, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selected.has(index)}
                    onCheckedChange={() => toggle(index)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-sm">{indicator.name}</span>
                      <span className="text-xs bg-primary/10 text-primary rounded px-2 py-1 whitespace-nowrap">
                        Meta: {indicator.goal_value} {indicator.unit}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setSuggestions([])} disabled={creating}>
                Gerar novamente
              </Button>
              <Button onClick={handleCreateIndicators} disabled={creating || selected.size === 0}>
                {creating ? "Criando..." : `Criar ${selected.size} indicador(es)`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
