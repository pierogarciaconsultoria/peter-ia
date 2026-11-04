import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Lock, PlusCircle, Save, Target, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BSC_PERSPECTIVE_LABELS, BSC_PERSPECTIVES, BscPerspectiveKey } from "@/types/strategic-planning";
import {
  createPillar,
  deletePillar,
  getPillars,
  getStrategy,
  MAX_PILLARS,
  Strategy,
  StrategyPillar,
  updatePillar,
  updateStrategy,
} from "@/services/strategic-planning/strategyService";

const NO_PERSPECTIVE = "__none__";

interface PillarDraft {
  id?: string;
  name: string;
  description: string;
  bsc_perspective: BscPerspectiveKey | null;
}

export function StrategyTab() {
  const { toast } = useToast();
  const { isAdmin } = useCurrentUser();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [pillars, setPillars] = useState<StrategyPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(false);
  const [ultimateGoal, setUltimateGoal] = useState("");
  const [horizonDate, setHorizonDate] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [pillarDraft, setPillarDraft] = useState<PillarDraft | null>(null);
  const [savingPillar, setSavingPillar] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([getStrategy(), getPillars()]);
      setStrategy(s);
      setPillars(p);
      setUltimateGoal(s?.ultimate_goal ?? "");
      setHorizonDate(s?.horizon_date ?? "");
    } catch (error) {
      console.error("Error loading strategy:", error);
      toast({ title: "Erro ao carregar a estratégia", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const saveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGoal(true);
    try {
      await updateStrategy({ ultimate_goal: ultimateGoal, horizon_date: horizonDate || null });
      toast({ title: "Estratégia salva" });
      setEditingGoal(false);
      await load();
    } catch (error) {
      console.error("Error saving strategy:", error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSavingGoal(false);
    }
  };

  const savePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillarDraft) return;
    setSavingPillar(true);
    try {
      if (pillarDraft.id) {
        await updatePillar(pillarDraft.id, {
          name: pillarDraft.name,
          description: pillarDraft.description,
          bsc_perspective: pillarDraft.bsc_perspective,
        });
      } else {
        await createPillar({
          name: pillarDraft.name,
          description: pillarDraft.description,
          bsc_perspective: pillarDraft.bsc_perspective,
          position: pillars.length,
        });
      }
      toast({ title: pillarDraft.id ? "Pilar atualizado" : "Pilar criado" });
      setPillarDraft(null);
      await load();
    } catch (error) {
      console.error("Error saving pillar:", error);
      const message = error instanceof Error ? error.message : "";
      toast({
        title: "Erro ao salvar pilar",
        description: message.includes("Limite") ? `Máximo de ${MAX_PILLARS} pilares por empresa` : "Apenas administradores da empresa podem editar a estratégia",
        variant: "destructive",
      });
    } finally {
      setSavingPillar(false);
    }
  };

  const removePillar = async (pillar: StrategyPillar) => {
    try {
      await deletePillar(pillar.id);
      toast({ title: "Pilar removido" });
      await load();
    } catch (error) {
      console.error("Error deleting pillar:", error);
      toast({ title: "Erro ao remover pilar", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent><p className="text-center text-muted-foreground py-12">Carregando...</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5" /> Objetivo Final
            </CardTitle>
            {isAdmin ? (
              !editingGoal && (
                <Button variant="outline" size="sm" onClick={() => setEditingGoal(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
              )
            ) : (
              <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> Edição pela direção</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Onde a empresa quer chegar e até quando. Os pilares desdobram esse objetivo, e os objetivos de cada ciclo se ligam a um pilar.
          </p>
        </CardHeader>
        <CardContent>
          {editingGoal ? (
            <form onSubmit={saveGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ultimate-goal">Objetivo final</Label>
                <Textarea
                  id="ultimate-goal"
                  rows={3}
                  placeholder="Ex: Ser a referência regional em serviços de engenharia, com R$ 20 milhões de faturamento e certificação ISO 9001 até 2029"
                  value={ultimateGoal}
                  onChange={(e) => setUltimateGoal(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="horizon-date">Horizonte</Label>
                <Input id="horizon-date" type="date" value={horizonDate} onChange={(e) => setHorizonDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setEditingGoal(false); setUltimateGoal(strategy?.ultimate_goal ?? ""); setHorizonDate(strategy?.horizon_date ?? ""); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={savingGoal}>
                  <Save className="h-4 w-4 mr-1" /> {savingGoal ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <p className={strategy?.ultimate_goal ? "text-base" : "text-muted-foreground"}>
                {strategy?.ultimate_goal || "Objetivo final ainda não definido."}
              </p>
              {strategy?.horizon_date && (
                <p className="text-sm text-muted-foreground">
                  Horizonte: {new Date(strategy.horizon_date + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              )}
              {strategy?.vision && (
                <p className="text-sm text-muted-foreground border-l-2 pl-3 mt-3">Visão: {strategy.vision}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold">Pilares Estratégicos</CardTitle>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                disabled={pillars.length >= MAX_PILLARS}
                onClick={() => setPillarDraft({ name: "", description: "", bsc_perspective: null })}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Adicionar pilar ({pillars.length}/{MAX_PILLARS})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pillars.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum pilar definido. Pilares são as 3 a 5 frentes que sustentam o objetivo final (ex: Excelência operacional, Crescimento, Pessoas).
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pillars.map((pillar, index) => (
                <div key={pillar.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">
                      <span className="text-muted-foreground mr-2">{index + 1}.</span>{pillar.name}
                    </h3>
                    {isAdmin && (
                      <div className="flex shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => setPillarDraft({ id: pillar.id, name: pillar.name, description: pillar.description, bsc_perspective: pillar.bsc_perspective })}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removePillar(pillar)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {pillar.description && <p className="text-sm text-muted-foreground">{pillar.description}</p>}
                  {pillar.bsc_perspective && (
                    <Badge variant="secondary">BSC: {BSC_PERSPECTIVE_LABELS[pillar.bsc_perspective]}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={pillarDraft !== null} onOpenChange={(open) => { if (!open) setPillarDraft(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          {pillarDraft && (
            <form onSubmit={savePillar} className="space-y-4">
              <DialogHeader>
                <DialogTitle>{pillarDraft.id ? "Editar pilar" : "Novo pilar"}</DialogTitle>
                <DialogDescription>Uma frente estratégica que sustenta o objetivo final.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="pillar-name">Nome</Label>
                <Input id="pillar-name" value={pillarDraft.name} onChange={(e) => setPillarDraft({ ...pillarDraft, name: e.target.value })} required maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pillar-description">Descrição</Label>
                <Textarea id="pillar-description" rows={2} value={pillarDraft.description} onChange={(e) => setPillarDraft({ ...pillarDraft, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Perspectiva BSC equivalente (opcional)</Label>
                <Select
                  value={pillarDraft.bsc_perspective ?? NO_PERSPECTIVE}
                  onValueChange={(v) => setPillarDraft({ ...pillarDraft, bsc_perspective: v === NO_PERSPECTIVE ? null : (v as BscPerspectiveKey) })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PERSPECTIVE}>Nenhuma</SelectItem>
                    {BSC_PERSPECTIVES.map(p => (
                      <SelectItem key={p} value={p}>{BSC_PERSPECTIVE_LABELS[p]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPillarDraft(null)}>Cancelar</Button>
                <Button type="submit" disabled={savingPillar}>{savingPillar ? "Salvando..." : "Salvar"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
