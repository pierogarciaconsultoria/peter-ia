import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ClipboardCheck, TrendingDown, TrendingUp, Crosshair } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { IndicatorType, MeasurementType } from "@/types/indicators";
import { createMeasurement, getAllIndicators, getAllMeasurements, updateMeasurement } from "@/services/indicatorService";
import { CheckIn, CONFIDENCE_LABELS, getLatestCheckIns } from "@/services/strategic-planning/checkInService";
import { CheckInDialog, CheckInTarget, CONFIDENCE_BADGE } from "./CheckInDialog";
import { useOwnerName } from "./OwnerSelect";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const DIRECTION_ICON: Record<IndicatorType["goal_type"], React.ElementType> = {
  higher_better: TrendingUp,
  lower_better: TrendingDown,
  target: Crosshair,
};

const DIRECTION_LABEL: Record<IndicatorType["goal_type"], string> = {
  higher_better: "Maior é melhor",
  lower_better: "Menor é melhor",
  target: "Valor exato",
};

/** Meta do mês: a da medição, senão a meta geral do indicador. */
function targetFor(indicator: IndicatorType, measurement?: MeasurementType): number {
  return measurement?.target != null ? Number(measurement.target) : Number(indicator.goal_value);
}

/** Fora da meta conforme a direção do indicador. */
export function isOffTarget(indicator: IndicatorType, value: number, target: number): boolean {
  switch (indicator.goal_type) {
    case "higher_better": return value < target;
    case "lower_better": return value > target;
    default: return Math.abs(value - target) > Math.abs(target) * 0.05;
  }
}

export function KpiBoard() {
  const { toast } = useToast();
  const ownerName = useOwnerName();
  const [indicators, setIndicators] = useState<IndicatorType[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);
  const [latestCheckIns, setLatestCheckIns] = useState<Map<string, CheckIn>>(new Map());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [checkInTarget, setCheckInTarget] = useState<CheckInTarget | null>(null);
  const [editingTarget, setEditingTarget] = useState<{ indicatorId: string; month: number; value: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ind, meas, latest] = await Promise.all([
        getAllIndicators(),
        getAllMeasurements(),
        getLatestCheckIns("kpi").catch(() => new Map<string, CheckIn>()),
      ]);
      setIndicators(ind);
      setMeasurements(meas);
      setLatestCheckIns(latest);
    } catch (error) {
      console.error("Error loading KPIs:", error);
      toast({ title: "Erro ao carregar KPIs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const byIndicator = useMemo(() => {
    const map = new Map<string, Map<number, MeasurementType>>();
    for (const m of measurements) {
      if (m.year !== year) continue;
      if (!map.has(m.indicator_id)) map.set(m.indicator_id, new Map());
      map.get(m.indicator_id)!.set(m.month, m);
    }
    return map;
  }, [measurements, year]);

  const years = useMemo(() => {
    const set = new Set(measurements.map(m => m.year));
    set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [measurements]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const offTargetCount = indicators.filter(ind => {
    const m = byIndicator.get(ind.id)?.get(currentMonth);
    return year === currentYear && m && isOffTarget(ind, Number(m.value), targetFor(ind, m));
  }).length;

  const saveTarget = async () => {
    if (!editingTarget) return;
    const indicator = indicators.find(i => i.id === editingTarget.indicatorId);
    if (!indicator) return;
    const value = editingTarget.value.trim() === "" ? null : parseFloat(editingTarget.value);
    if (value !== null && !Number.isFinite(value)) return;
    const existing = byIndicator.get(indicator.id)?.get(editingTarget.month);
    try {
      if (existing) {
        await updateMeasurement(existing.id, { target: value });
      } else if (value !== null) {
        // Sem realizado ainda: grava a meta com valor 0 marcado em notas
        await createMeasurement({ indicator_id: indicator.id, month: editingTarget.month, year, value: 0, target: value, notes: "Meta definida; realizado pendente" });
      }
      setEditingTarget(null);
      await load();
    } catch (error) {
      console.error("Error saving monthly target:", error);
      toast({ title: "Erro ao salvar meta do mês", variant: "destructive" });
    }
  };

  const openCheckIn = (indicator: IndicatorType, month: number) => {
    const m = byIndicator.get(indicator.id)?.get(month);
    setCheckInTarget({
      entity_type: "kpi",
      entity_id: indicator.id,
      name: indicator.name,
      unit: indicator.unit || "",
      target: targetFor(indicator, m),
      current_value: m ? Number(m.value) : null,
      month,
      year,
    });
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent><p className="text-center text-muted-foreground py-12">Carregando...</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold">KPIs</CardTitle>
            <p className="text-sm text-muted-foreground">
              Meta e realizado por mês. Clique em uma célula para registrar o check-in; clique na meta para ajustá-la.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {offTargetCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> {offTargetCount} fora da meta este mês
              </Badge>
            )}
            <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v, 10))}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {indicators.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum KPI cadastrado. Crie indicadores no módulo de Indicadores ou a partir de um resultado-chave em Metas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">KPI</TableHead>
                  {MONTHS.map((m, i) => (
                    <TableHead key={m} className={cn("text-center min-w-[72px]", year === currentYear && i + 1 === currentMonth && "bg-muted/60")}>{m}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {indicators.map(indicator => {
                  const Icon = DIRECTION_ICON[indicator.goal_type] || Crosshair;
                  const latest = latestCheckIns.get(`kpi:${indicator.id}`);
                  const owner = ownerName(indicator.owner_id);
                  return (
                    <TableRow key={indicator.id}>
                      <TableCell className="align-top">
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          <span className="inline-flex items-center gap-1" title={DIRECTION_LABEL[indicator.goal_type]}>
                            <Icon className="h-3 w-3" /> {indicator.goal_value} {indicator.unit}
                          </span>
                          <span>· {indicator.process}</span>
                          {owner && <span>· {owner}</span>}
                          {latest && (
                            <Badge variant="outline" className={cn("text-[10px]", CONFIDENCE_BADGE[latest.confidence])}>
                              {CONFIDENCE_LABELS[latest.confidence]}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      {MONTHS.map((_, i) => {
                        const month = i + 1;
                        const m = byIndicator.get(indicator.id)?.get(month);
                        const target = targetFor(indicator, m);
                        const hasValue = !!m && !(m.notes === "Meta definida; realizado pendente" && Number(m.value) === 0);
                        const off = hasValue && isOffTarget(indicator, Number(m!.value), target);
                        const isEditing = editingTarget?.indicatorId === indicator.id && editingTarget.month === month;
                        const isFuture = year > currentYear || (year === currentYear && month > currentMonth);
                        return (
                          <TableCell key={month} className={cn("text-center p-1 align-top", year === currentYear && month === currentMonth && "bg-muted/40")}>
                            <button
                              type="button"
                              disabled={isFuture}
                              onClick={() => openCheckIn(indicator, month)}
                              className={cn(
                                "w-full rounded-md px-1 py-1 text-sm font-medium transition-colors",
                                hasValue && off && "bg-red-100 text-red-800",
                                hasValue && !off && "bg-green-100 text-green-800",
                                !hasValue && !isFuture && "text-muted-foreground hover:bg-muted",
                                isFuture && "text-muted-foreground/40 cursor-not-allowed"
                              )}
                              title={hasValue ? (off ? "Fora da meta" : "Na meta") : "Registrar check-in"}
                            >
                              {hasValue ? Number(m!.value) : isFuture ? "–" : <ClipboardCheck className="h-3.5 w-3.5 mx-auto" />}
                            </button>
                            {isEditing ? (
                              <Input
                                autoFocus
                                type="number"
                                step="any"
                                className="h-6 text-xs mt-1 px-1"
                                value={editingTarget.value}
                                onChange={(e) => setEditingTarget({ ...editingTarget, value: e.target.value })}
                                onBlur={saveTarget}
                                onKeyDown={(e) => { if (e.key === "Enter") saveTarget(); if (e.key === "Escape") setEditingTarget(null); }}
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingTarget({ indicatorId: indicator.id, month, value: m?.target != null ? String(m.target) : "" })}
                                className="text-[10px] text-muted-foreground hover:text-foreground mt-0.5"
                                title="Meta do mês (clique para editar)"
                              >
                                meta {target}
                              </button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <CheckInDialog target={checkInTarget} onClose={() => setCheckInTarget(null)} onSaved={load} />
    </Card>
  );
}
