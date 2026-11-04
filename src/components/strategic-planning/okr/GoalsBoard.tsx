import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle, CalendarPlus, CheckCircle2, ClipboardCheck, Edit, Link2, PlusCircle, Sparkles, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useActiveEmployees } from "@/hooks/useActiveEmployees";
import { cn } from "@/lib/utils";
import { BscMeasure, BscObjective, OBJECTIVE_STATUS_LABELS } from "@/types/strategic-planning";
import { deleteKeyResult, deleteObjective, getObjectives, MAX_KEY_RESULTS } from "@/services/strategic-planning/bscService";
import { Cycle, CYCLE_TYPE_LABELS, getCurrentCycle, getCycles } from "@/services/strategic-planning/cycleService";
import { getPillars, StrategyPillar } from "@/services/strategic-planning/strategyService";
import { CheckIn, CONFIDENCE_LABELS, getLatestCheckIns, isCheckInOverdue } from "@/services/strategic-planning/checkInService";
import { ObjectiveForm } from "./ObjectiveForm";
import { KeyResultForm } from "./KeyResultForm";
import { CloseObjectiveDialog } from "./CloseObjectiveDialog";
import { CycleForm } from "./CycleForm";
import { CheckInDialog, CheckInTarget, CONFIDENCE_BADGE } from "./CheckInDialog";
import { useOwnerName } from "./OwnerSelect";

type Filter = "all" | "off_track" | "mine" | "closed";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Todos os objetivos",
  off_track: "Fora do rumo",
  mine: "Meus objetivos",
  closed: "Encerrados",
};

const percent = (p: number | null | undefined) => (p === null || p === undefined ? null : Math.round(p * 100));

export function GoalsBoard() {
  const { toast } = useToast();
  const { empresaId, userProfile, user } = useCurrentUser();
  const { employees } = useActiveEmployees();
  const ownerName = useOwnerName();

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState<string>("");
  const [pillars, setPillars] = useState<StrategyPillar[]>([]);
  const [objectives, setObjectives] = useState<BscObjective[]>([]);
  const [latestCheckIns, setLatestCheckIns] = useState<Map<string, CheckIn>>(new Map());
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const [objectiveDialog, setObjectiveDialog] = useState<{ objective?: BscObjective } | null>(null);
  const [krDialog, setKrDialog] = useState<{ objective: BscObjective; keyResult?: BscMeasure } | null>(null);
  const [closing, setClosing] = useState<BscObjective | null>(null);
  const [cycleDialog, setCycleDialog] = useState(false);
  const [checkInTarget, setCheckInTarget] = useState<CheckInTarget | null>(null);
  const [deleting, setDeleting] = useState<{ type: "objective" | "kr"; id: string; title: string } | null>(null);

  const loadCycles = useCallback(async () => {
    if (!empresaId) return;
    const current = await getCurrentCycle(empresaId);
    const list = await getCycles();
    setCycles(list);
    setCycleId(prev => prev || current?.id || list[0]?.id || "");
  }, [empresaId]);

  const loadObjectives = useCallback(async () => {
    if (!cycleId) return;
    setLoading(true);
    try {
      const [objs, p, latest] = await Promise.all([
        getObjectives({ cycleId }),
        getPillars().catch(() => [] as StrategyPillar[]),
        getLatestCheckIns("kr").catch(() => new Map<string, CheckIn>()),
      ]);
      setObjectives(objs);
      setPillars(p);
      setLatestCheckIns(latest);
    } catch (error) {
      console.error("Error loading objectives:", error);
      toast({ title: "Erro ao carregar objetivos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [cycleId, toast]);

  useEffect(() => {
    loadCycles().catch(error => {
      console.error("Error loading cycles:", error);
      toast({ title: "Erro ao carregar ciclos", variant: "destructive" });
      setLoading(false);
    });
  }, [loadCycles, toast]);

  useEffect(() => { loadObjectives(); }, [loadObjectives]);

  const cycle = cycles.find(c => c.id === cycleId);
  const frequency = cycle?.check_in_frequency_days ?? 7;

  // "Meus objetivos": colaborador com o mesmo nome do usuário logado, ou objetivo criado por ele
  const myEmployeeId = useMemo(() => {
    const fullName = `${userProfile?.first_name ?? ""} ${userProfile?.last_name ?? ""}`.trim().toLowerCase();
    if (!fullName) return null;
    return employees.find(e => e.name.trim().toLowerCase() === fullName)?.id ?? null;
  }, [employees, userProfile]);

  const krConfidence = (kr: BscMeasure) => latestCheckIns.get(`kr:${kr.id}`);

  const isObjectiveOffTrack = (o: BscObjective) =>
    o.status === "active" && o.measures.some(kr => {
      const c = krConfidence(kr);
      return c?.confidence === "off_track" || c?.confidence === "at_risk" || isCheckInOverdue(c, frequency);
    });

  const isMine = (o: BscObjective) =>
    (myEmployeeId !== null && (o.owner_id === myEmployeeId || o.measures.some(kr => kr.owner_id === myEmployeeId))) ||
    (!!user?.id && o.created_by === user.id);

  const visible = objectives.filter(o => {
    switch (filter) {
      case "off_track": return isObjectiveOffTrack(o);
      case "mine": return isMine(o);
      case "closed": return o.status !== "active";
      default: return o.status === "active";
    }
  });

  const grouped = useMemo(() => {
    const groups: { key: string; label: string; items: BscObjective[] }[] = [];
    for (const pillar of pillars) {
      const items = visible.filter(o => o.pillar_id === pillar.id);
      if (items.length) groups.push({ key: pillar.id, label: pillar.name, items });
    }
    const rest = visible.filter(o => !o.pillar_id || !pillars.some(p => p.id === o.pillar_id));
    if (rest.length) groups.push({ key: "none", label: pillars.length ? "Sem pilar" : "Objetivos", items: rest });
    return groups;
  }, [visible, pillars]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      if (deleting.type === "objective") await deleteObjective(deleting.id);
      else await deleteKeyResult(deleting.id);
      toast({ title: deleting.type === "objective" ? "Objetivo excluído" : "Resultado-chave excluído" });
      setDeleting(null);
      await loadObjectives();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const activeCount = objectives.filter(o => o.status === "active").length;
  const offTrackCount = objectives.filter(isObjectiveOffTrack).length;
  const cycleProgress = (() => {
    const values = objectives.filter(o => o.status === "active").map(o => o.progress).filter((p): p is number => p !== null);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  })();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-bold">Metas (OKR)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Objetivos por ciclo com resultados-chave. Progresso do objetivo = média dos resultados-chave.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={cycleId} onValueChange={setCycleId}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Ciclo" /></SelectTrigger>
                <SelectContent>
                  {cycles.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} · {CYCLE_TYPE_LABELS[c.type]}{c.status === "closed" ? " (encerrado)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setCycleDialog(true)} title="Novo ciclo">
                <CalendarPlus className="h-4 w-4" />
              </Button>
              <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
                    <SelectItem key={f} value={f}>{FILTER_LABELS[f]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => setObjectiveDialog({})} disabled={!cycleId}>
                <PlusCircle className="h-4 w-4 mr-1" /> Novo objetivo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {cycle && (
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6 rounded-md bg-muted/40 p-3">
              <span>
                <strong>{cycle.name}</strong> · {new Date(cycle.start_date + "T00:00:00").toLocaleDateString("pt-BR")} a {new Date(cycle.end_date + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
              <span>{activeCount} objetivo(s) ativo(s)</span>
              {offTrackCount > 0 && (
                <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> {offTrackCount} fora do rumo</Badge>
              )}
              {cycleProgress !== null && (
                <span className="flex items-center gap-2 ml-auto min-w-[160px]">
                  <Progress value={cycleProgress * 100} className="h-2 flex-1" />
                  <span className="font-medium">{percent(cycleProgress)}%</span>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Carregando...</p>
          ) : visible.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 space-y-3">
              <p>
                {filter === "all"
                  ? "Nenhum objetivo neste ciclo. Crie o primeiro ou gere sugestões pela Análise Inteligente."
                  : `Nenhum objetivo em "${FILTER_LABELS[filter]}".`}
              </p>
              {filter === "all" && (
                <Button variant="outline" onClick={() => setObjectiveDialog({})} disabled={!cycleId}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Novo objetivo
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(group => (
                <div key={group.key} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</h3>
                  {group.items.map(objective => {
                    const offTrack = isObjectiveOffTrack(objective);
                    const owner = ownerName(objective.owner_id);
                    const parent = objectives.find(o => o.id === objective.parent_objective_id);
                    return (
                      <Card key={objective.id} className={cn(offTrack && "border-red-300")}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold">{objective.title}</h4>
                                {objective.source === "ai" && <Sparkles size={14} className="text-primary" />}
                                {objective.status !== "active" && (
                                  <Badge variant="secondary">
                                    {OBJECTIVE_STATUS_LABELS[objective.status]}
                                    {objective.score !== null ? ` · nota ${Math.round(Number(objective.score) * 100)}%` : ""}
                                  </Badge>
                                )}
                                {offTrack && <Badge variant="destructive">Fora do rumo</Badge>}
                              </div>
                              {objective.description && <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>}
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 mt-1">
                                {owner && <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {owner}</span>}
                                {parent && <span>Desdobra: {parent.title}</span>}
                              </div>
                              {objective.status !== "active" && objective.learnings && (
                                <p className="text-xs mt-2 border-l-2 pl-2 text-muted-foreground">Aprendizados: {objective.learnings}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="w-28 text-right">
                                <Progress value={(objective.progress ?? 0) * 100} className="h-2" />
                                <span className="text-xs text-muted-foreground">
                                  {objective.progress === null ? "sem medição" : `${percent(objective.progress)}%`}
                                </span>
                              </div>
                              {objective.status === "active" && (
                                <div className="flex">
                                  <Button variant="ghost" size="sm" title="Editar" onClick={() => setObjectiveDialog({ objective })}><Edit size={14} /></Button>
                                  <Button variant="ghost" size="sm" title="Encerrar com nota" onClick={() => setClosing(objective)}><CheckCircle2 size={14} /></Button>
                                  <Button variant="ghost" size="sm" title="Excluir" onClick={() => setDeleting({ type: "objective", id: objective.id, title: objective.title })}><Trash2 size={14} className="text-destructive" /></Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {objective.measures.map(kr => {
                              const c = krConfidence(kr);
                              const overdue = objective.status === "active" && isCheckInOverdue(c, frequency);
                              const krOwner = ownerName(kr.owner_id);
                              return (
                                <div key={kr.id} className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2 text-sm">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-medium truncate">{kr.name}</span>
                                      {kr.indicator_id && <Link2 size={12} className="text-primary" aria-label="Ligado a KPI" />}
                                      {c && (
                                        <Badge variant="outline" className={cn("text-[10px]", CONFIDENCE_BADGE[c.confidence])}>
                                          {CONFIDENCE_LABELS[c.confidence]}
                                        </Badge>
                                      )}
                                      {overdue && <Badge variant="outline" className="text-[10px] text-yellow-800 bg-yellow-50">check-in pendente</Badge>}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {kr.start_value} → {kr.current_value ?? kr.start_value} / {kr.target} {kr.unit}
                                      {krOwner ? ` · ${krOwner}` : ""}
                                    </div>
                                  </div>
                                  <div className="w-24">
                                    <Progress value={(kr.progress ?? 0) * 100} className="h-1.5" />
                                    <span className="text-[10px] text-muted-foreground">{kr.progress === null ? "–" : `${percent(kr.progress)}%`}</span>
                                  </div>
                                  {objective.status === "active" && (
                                    <div className="flex shrink-0">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7"
                                        onClick={() => setCheckInTarget({
                                          entity_type: "kr", entity_id: kr.id, name: kr.name, unit: kr.unit,
                                          target: kr.target, current_value: kr.current_value,
                                        })}
                                      >
                                        <ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Check-in
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7" onClick={() => setKrDialog({ objective, keyResult: kr })}><Edit size={12} /></Button>
                                      <Button variant="ghost" size="sm" className="h-7" onClick={() => setDeleting({ type: "kr", id: kr.id, title: kr.name })}><Trash2 size={12} className="text-destructive" /></Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {objective.status === "active" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => setKrDialog({ objective })}
                              >
                                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                Resultado-chave ({objective.measures.length}/{MAX_KEY_RESULTS})
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={objectiveDialog !== null} onOpenChange={(open) => { if (!open) setObjectiveDialog(null); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{objectiveDialog?.objective ? "Editar objetivo" : "Novo objetivo"}</DialogTitle>
            <DialogDescription>O objetivo descreve a mudança desejada. Os resultados-chave medem o avanço.</DialogDescription>
          </DialogHeader>
          {objectiveDialog && (
            <ObjectiveForm
              objective={objectiveDialog.objective}
              cycles={cycles}
              defaultCycleId={cycleId}
              pillars={pillars}
              parentCandidates={objectives.filter(o => o.status === "active" && !o.parent_objective_id)}
              onSaved={() => { setObjectiveDialog(null); loadObjectives(); }}
              onCancel={() => setObjectiveDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={krDialog !== null} onOpenChange={(open) => { if (!open) setKrDialog(null); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{krDialog?.keyResult ? "Editar resultado-chave" : "Novo resultado-chave"}</DialogTitle>
            <DialogDescription>{krDialog?.objective.title}</DialogDescription>
          </DialogHeader>
          {krDialog && (
            <KeyResultForm
              objectiveId={krDialog.objective.id}
              objectiveTitle={krDialog.objective.title}
              existingCount={krDialog.objective.measures.length}
              keyResult={krDialog.keyResult}
              onSaved={() => { setKrDialog(null); loadObjectives(); }}
              onCancel={() => setKrDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={cycleDialog} onOpenChange={setCycleDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Novo ciclo</DialogTitle>
            <DialogDescription>Metas anuais da empresa e trimestrais das áreas.</DialogDescription>
          </DialogHeader>
          <CycleForm
            onSaved={async (c) => { setCycleDialog(false); await loadCycles(); setCycleId(c.id); }}
            onCancel={() => setCycleDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <CloseObjectiveDialog objective={closing} onClose={() => setClosing(null)} onSaved={loadObjectives} />
      <CheckInDialog target={checkInTarget} onClose={() => setCheckInTarget(null)} onSaved={loadObjectives} />

      <AlertDialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {deleting?.type === "objective" ? "objetivo" : "resultado-chave"}</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" será removido{deleting?.type === "objective" ? " junto com seus resultados-chave" : ""}. Os KPIs vinculados são mantidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
