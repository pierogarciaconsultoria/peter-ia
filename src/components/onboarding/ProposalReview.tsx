import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingProposal } from "@/services/onboarding/onboardingService";
import { BSC_PERSPECTIVE_LABELS } from "@/types/strategic-planning";

interface ProposalReviewProps {
  proposal: OnboardingProposal;
  onChange: (proposal: OnboardingProposal) => void;
}

const SWOT_LABELS = { strength: 'Força', weakness: 'Fraqueza', opportunity: 'Oportunidade', threat: 'Ameaça' } as const;

interface BlockProps {
  title: string;
  count: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  onToggleAll?: (included: boolean) => void;
}

function Block({ title, count, defaultOpen = false, children, onToggleAll }: BlockProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <CardHeader className="py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{count}</Badge>
            {onToggleAll && open && (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onToggleAll(true)}>Todos</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onToggleAll(false)}>Nenhum</Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      {open && <CardContent className="pt-0 space-y-2">{children}</CardContent>}
    </Card>
  );
}

interface ItemProps {
  included: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  tag?: string;
  ai?: boolean;
}

function Item({ included, onToggle, title, subtitle, tag, ai }: ItemProps) {
  return (
    <label className={cn("flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50", !included && "opacity-60")}>
      <Checkbox checked={included} onCheckedChange={onToggle} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">{title}</span>
          {ai && <Sparkles size={12} className="text-primary" aria-label="Sugerido pela IA" />}
          {tag && <Badge variant="outline" className="text-[10px]">{tag}</Badge>}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </label>
  );
}

const countIncluded = <T extends { included: boolean }>(items: T[]) => `${items.filter(i => i.included).length}/${items.length}`;

export function ProposalReview({ proposal, onChange }: ProposalReviewProps) {
  const update = (patch: Partial<OnboardingProposal>) => onChange({ ...proposal, ...patch });
  const toggleAt = <K extends 'pillars' | 'swot' | 'objectives' | 'processes' | 'indicators' | 'risks' | 'actions'>(key: K, index: number) => {
    const list = proposal[key].map((item, i) => (i === index ? { ...item, included: !item.included } : item)) as OnboardingProposal[K];
    update({ [key]: list } as Partial<OnboardingProposal>);
  };
  const toggleAll = <K extends 'pillars' | 'swot' | 'objectives' | 'processes' | 'indicators' | 'risks' | 'actions'>(key: K, included: boolean) => {
    const list = proposal[key].map(item => ({ ...item, included })) as OnboardingProposal[K];
    update({ [key]: list } as Partial<OnboardingProposal>);
  };

  return (
    <div className="space-y-3">
      {proposal.aiUnavailable && (
        <p className="rounded-md bg-yellow-50 text-yellow-800 text-sm p-3">
          A IA não respondeu agora. A proposta abaixo vem do template do segmento. Você pode gerar a identidade e os objetivos depois, em Análise Inteligente.
        </p>
      )}

      <Block title="Identidade e objetivo final" count={proposal.mission ? "preenchida" : "vazia"} defaultOpen>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Missão</Label>
            <Textarea rows={2} value={proposal.mission} onChange={(e) => update({ mission: e.target.value })} placeholder="Por que a empresa existe" />
          </div>
          <div className="space-y-1">
            <Label>Visão</Label>
            <Textarea rows={2} value={proposal.vision} onChange={(e) => update({ vision: e.target.value })} placeholder="Onde quer chegar" />
          </div>
          <div className="space-y-1">
            <Label>Objetivo final (3 a 5 anos)</Label>
            <Input value={proposal.ultimate_goal} onChange={(e) => update({ ultimate_goal: e.target.value })} placeholder="Ex: Dobrar o faturamento com certificação ISO 9001 até 2029" />
          </div>
          <div className="space-y-1">
            <Label>Valores (separados por vírgula)</Label>
            <Input
              value={proposal.values.join(', ')}
              onChange={(e) => update({ values: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
              placeholder="Ética, Segurança, Qualidade"
            />
          </div>
        </div>
      </Block>

      <Block title="Pilares estratégicos" count={countIncluded(proposal.pillars)} onToggleAll={(v) => toggleAll('pillars', v)}>
        {proposal.pillars.map((p, i) => (
          <Item key={i} included={p.included} onToggle={() => toggleAt('pillars', i)} title={p.name} subtitle={p.description} tag={p.bsc_perspective ? BSC_PERSPECTIVE_LABELS[p.bsc_perspective] : undefined} ai />
        ))}
        {proposal.pillars.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pilar sugerido. Defina depois em Estratégia.</p>}
      </Block>

      <Block title="Processos" count={countIncluded(proposal.processes)} defaultOpen onToggleAll={(v) => toggleAll('processes', v)}>
        {proposal.processes.map((p, i) => (
          <Item key={p.key} included={p.included} onToggle={() => toggleAt('processes', i)} title={p.name} subtitle={p.objective} tag={p.type} />
        ))}
        {proposal.processes.length === 0 && <p className="text-sm text-muted-foreground">Este segmento ainda não tem template de processos. Cadastre em Processos.</p>}
      </Block>

      <Block title="Indicadores" count={countIncluded(proposal.indicators)} onToggleAll={(v) => toggleAll('indicators', v)}>
        {proposal.indicators.map((ind, i) => (
          <Item
            key={`${ind.origin}-${ind.name}`}
            included={ind.included}
            onToggle={() => toggleAt('indicators', i)}
            title={ind.name}
            subtitle={`${ind.description} · meta ${ind.goal_value} ${ind.unit}`}
            tag={ind.processName}
            ai={ind.origin === 'ai'}
          />
        ))}
      </Block>

      <Block title="Objetivos e resultados-chave" count={countIncluded(proposal.objectives)} onToggleAll={(v) => toggleAll('objectives', v)}>
        {proposal.objectives.map((o, i) => (
          <Item
            key={i}
            included={o.included}
            onToggle={() => toggleAt('objectives', i)}
            title={o.title}
            subtitle={o.measure ? `${o.measure.name}: de ${o.measure.start_value ?? 0} para ${o.measure.target} ${o.measure.unit}` : o.description}
            tag={BSC_PERSPECTIVE_LABELS[o.perspective]}
            ai
          />
        ))}
        {proposal.objectives.length === 0 && <p className="text-sm text-muted-foreground">Sem objetivos sugeridos. Crie em Metas.</p>}
      </Block>

      <Block title="Análise SWOT" count={countIncluded(proposal.swot)} onToggleAll={(v) => toggleAll('swot', v)}>
        {proposal.swot.map((s, i) => (
          <Item key={i} included={s.included} onToggle={() => toggleAt('swot', i)} title={s.description} tag={`${SWOT_LABELS[s.category]} · impacto ${s.impact_level}`} ai />
        ))}
        {proposal.swot.length === 0 && <p className="text-sm text-muted-foreground">Sem itens SWOT sugeridos.</p>}
      </Block>

      <Block title="Riscos" count={countIncluded(proposal.risks)} onToggleAll={(v) => toggleAll('risks', v)}>
        {proposal.risks.map((r, i) => (
          <Item
            key={`${r.origin}-${r.title}`}
            included={r.included}
            onToggle={() => toggleAt('risks', i)}
            title={r.title}
            subtitle={`${r.description} · ${r.mitigation_plan}`}
            tag={`${r.processName} · nível ${r.probability * r.impact}`}
            ai={r.origin === 'ai'}
          />
        ))}
      </Block>

      <Block title="Plano de 90 dias" count={countIncluded(proposal.actions)} onToggleAll={(v) => toggleAll('actions', v)}>
        {proposal.actions.map((a, i) => (
          <Item key={i} included={a.included} onToggle={() => toggleAt('actions', i)} title={a.title} subtitle={`${a.why} · prazo ${new Date(a.due_date + 'T00:00:00').toLocaleDateString('pt-BR')}`} tag={a.priority} ai />
        ))}
        {proposal.actions.length === 0 && <p className="text-sm text-muted-foreground">Sem ações sugeridas.</p>}
      </Block>
    </div>
  );
}
