import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { getSegmentTemplate, SEGMENTS, SegmentKey } from "@/data/templates";
import {
  applyProposal,
  completeOnboarding,
  generateProposal,
  OnboardingCompanyInput,
  OnboardingProposal,
} from "@/services/onboarding/onboardingService";
import { ProposalReview } from "./ProposalReview";

const SIZES = [
  'Microempresa (até 9 funcionários)',
  'Pequena (10-49 funcionários)',
  'Média (50-249 funcionários)',
  'Grande (250+ funcionários)',
];

const STEPS = ['Sua empresa', 'Operação e objetivos', 'Proposta', 'Pronto'];

const GENERATING_MESSAGES = [
  'Lendo o que você contou sobre a empresa...',
  'Montando os processos típicos do segmento...',
  'Escrevendo missão, visão e objetivo final...',
  'Definindo indicadores e metas iniciais...',
  'Levantando riscos e um plano de 90 dias...',
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { empresaId, userCompany } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<OnboardingCompanyInput>({
    name: userCompany?.name ?? '',
    segment: 'industria',
    subsegment: '',
    company_size: SIZES[1],
    company_description: '',
    operational_problems: '',
    business_objectives: '',
    company_website: '',
    company_instagram: '',
  });
  const [proposal, setProposal] = useState<OnboardingProposal | null>(null);
  const [generating, setGenerating] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [applying, setApplying] = useState(false);
  const [summary, setSummary] = useState<string[]>([]);

  const template = getSegmentTemplate(input.segment);

  useEffect(() => {
    if (!userCompany?.name || input.name) return;
    setInput(prev => ({ ...prev, name: userCompany.name }));
  }, [userCompany?.name, input.name]);

  // Pré-carrega descrição e objetivos já gravados na empresa (ex.: pela Análise Inteligente)
  useEffect(() => {
    if (!empresaId) return;
    supabase.from('companies').select('company_description, operational_problems, business_objectives, company_size, company_subsector').eq('id', empresaId).maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setInput(prev => ({
          ...prev,
          company_description: prev.company_description || data.company_description || '',
          operational_problems: prev.operational_problems || data.operational_problems || '',
          business_objectives: prev.business_objectives || data.business_objectives || '',
          company_size: data.company_size || prev.company_size,
          subsegment: prev.subsegment || data.company_subsector || '',
        }));
      });
  }, [empresaId]);

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => setMessageIndex(i => (i + 1) % GENERATING_MESSAGES.length), 2500);
    return () => clearInterval(timer);
  }, [generating]);

  const set = (field: keyof OnboardingCompanyInput, value: string) => setInput(prev => ({ ...prev, [field]: value }));

  const canGoToGoals = input.name.trim() !== '' && input.company_size !== '';
  const canGenerate = input.company_description.trim().length >= 20;

  const handleGenerate = async () => {
    if (!empresaId) return;
    setGenerating(true);
    setMessageIndex(0);
    try {
      const result = await generateProposal(empresaId, input);
      setProposal(result);
      setStep(2);
      if (result.aiUnavailable) toast.warning('A IA não respondeu. Proposta montada com o template do segmento.');
    } catch (error) {
      console.error('Erro ao gerar proposta:', error);
      toast.error('Não foi possível montar a proposta. Tente de novo em instantes.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = async () => {
    if (!empresaId || !proposal) return;
    setApplying(true);
    try {
      const result = await applyProposal(empresaId, proposal);
      setSummary([
        `${result.processes} processos`,
        `${result.indicators} indicadores`,
        `${result.objectives} objetivos com resultado-chave`,
        `${result.risks} riscos`,
        `${result.actions} ações do plano de 90 dias`,
      ]);
      setStep(3);
    } catch (error) {
      console.error('Erro ao aplicar proposta:', error);
      toast.error('Parte da proposta não pôde ser gravada. Veja o console e tente de novo.');
    } finally {
      setApplying(false);
    }
  };

  const handleSkip = async () => {
    if (!empresaId) return;
    try {
      await completeOnboarding(empresaId);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Erro ao pular onboarding:', error);
      toast.error('Não foi possível pular agora.');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" /> Vamos montar a sua empresa no Peter.IA
            </h1>
            {step < 3 && (
              <Button variant="ghost" size="sm" onClick={handleSkip}>Pular por agora</Button>
            )}
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground">Passo {step + 1} de {STEPS.length}: {STEPS[step]}</p>
        </div>

        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sua empresa</CardTitle>
              <CardDescription>Em 20 minutos você sai daqui com processos, indicadores, metas e um plano de 90 dias prontos para revisar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ob-name">Nome da empresa</Label>
                <Input id="ob-name" value={input.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Segmento</Label>
                  <Select value={input.segment} onValueChange={(v) => { set('segment', v as SegmentKey); set('subsegment', ''); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEGMENTS.map(s => (
                        <SelectItem key={s.key} value={s.key}>{s.label}{s.hasTemplate ? '' : ' (sem template, só IA)'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subsegmento</Label>
                  {template ? (
                    <Select value={input.subsegment || undefined} onValueChange={(v) => set('subsegment', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {template.subsegments.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={input.subsegment} onChange={(e) => set('subsegment', e.target.value)} placeholder="Ex: clínica odontológica" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Porte</Label>
                  <Select value={input.company_size} onValueChange={(v) => set('company_size', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-site">Site <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                  <Input id="ob-site" value={input.company_website} onChange={(e) => set('company_website', e.target.value)} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ob-insta">Instagram <span className="text-xs text-muted-foreground">(opcional)</span></Label>
                  <Input id="ob-insta" value={input.company_instagram} onChange={(e) => set('company_instagram', e.target.value)} placeholder="@empresa" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(1)} disabled={!canGoToGoals}>
                  Continuar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Operação e objetivos</CardTitle>
              <CardDescription>Quanto mais concreto, melhor fica a proposta. Escreva como explicaria para um consultor no primeiro dia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ob-desc">O que a empresa faz e para quem</Label>
                <Textarea id="ob-desc" rows={4} value={input.company_description} onChange={(e) => set('company_description', e.target.value)}
                  placeholder="Ex: Fabricamos peças usinadas sob encomenda para montadoras de implementos agrícolas. 35 funcionários, 2 turnos, 12 clientes ativos." />
                <p className="text-xs text-muted-foreground">Mínimo de 20 caracteres.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-problems">O que mais atrapalha hoje</Label>
                <Textarea id="ob-problems" rows={3} value={input.operational_problems} onChange={(e) => set('operational_problems', e.target.value)}
                  placeholder="Ex: atrasos de entrega, retrabalho alto, dependência de um fornecedor, falta de controle de estoque." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-goals">Onde quer chegar nos próximos anos</Label>
                <Textarea id="ob-goals" rows={3} value={input.business_objectives} onChange={(e) => set('business_objectives', e.target.value)}
                  placeholder="Ex: certificar ISO 9001 em 2027, dobrar o faturamento, abrir um segundo turno." />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)} disabled={generating}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
                <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
                  {generating ? <><LoaderCircle className="h-4 w-4 mr-1 animate-spin" /> Montando...</> : <><Sparkles className="h-4 w-4 mr-1" /> Montar proposta</>}
                </Button>
              </div>
              {generating && (
                <p className="text-sm text-muted-foreground text-center">{GENERATING_MESSAGES[messageIndex]}</p>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && proposal && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revise a proposta</CardTitle>
                <CardDescription>
                  Desmarque o que não faz sentido e ajuste os textos. Tudo pode ser editado depois nos módulos. O que estiver marcado será gravado agora.
                </CardDescription>
              </CardHeader>
            </Card>
            <ProposalReview proposal={proposal} onChange={setProposal} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} disabled={applying}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Ajustar respostas
              </Button>
              <Button onClick={handleApply} disabled={applying}>
                {applying ? <><LoaderCircle className="h-4 w-4 mr-1 animate-spin" /> Gravando...</> : <><Check className="h-4 w-4 mr-1" /> Aplicar e começar</>}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Empresa montada</CardTitle>
              <CardDescription>Foi gravado agora:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 text-sm space-y-1">
                {summary.map(line => <li key={line}>{line}</li>)}
              </ul>
              <p className="text-sm text-muted-foreground">
                Próximo passo: cadastre os responsáveis em Gente e Gestão e defina o dono de cada processo e indicador.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => navigate('/strategic-planning/goals', { replace: true })}>Ver as metas</Button>
                <Button onClick={() => navigate('/dashboard', { replace: true })}>Ir para o dashboard</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
