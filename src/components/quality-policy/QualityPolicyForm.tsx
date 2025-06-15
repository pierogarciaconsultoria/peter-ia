import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useActionPlans } from "@/hooks/useActionPlans";
import { usePerformanceIndicators } from "@/hooks/usePerformanceIndicators";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { QuickCreateActionPlan } from "./QuickCreateActionPlan";
import { QuickCreateIndicator } from "./QuickCreateIndicator";

type Props = {
  value: string;
  relatedActionPlans?: string[];
  relatedIndicators?: string[];
  onSave: (policy: string, actionPlans: string[], indicators: string[]) => Promise<void>;
  loading?: boolean;
};

export default function QualityPolicyForm({
  value,
  relatedActionPlans = [],
  relatedIndicators = [],
  onSave,
  loading,
}: Props) {
  const [text, setText] = useState(value);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(relatedActionPlans);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(relatedIndicators);

  const { empresaId } = useCurrentUser() || {};

  const { actionPlans } = useActionPlans(empresaId);
  const { indicators } = usePerformanceIndicators(empresaId);

  // Novos handlers: ao criar plano/indicador, adiciona ao MultiSelect
  function handleActionPlanCreated(plan: { id: string; title: string }) {
    setSelectedPlans(prev => [...prev, plan.id]);
  }
  function handleIndicatorCreated(indicator: { id: string; name: string }) {
    setSelectedIndicators(prev => [...prev, indicator.id]);
  }

  // Para MultiSelect:
  const planOptions: Option[] = actionPlans.map(p => ({ value: p.id, label: p.title }));
  const selectedPlanOptions = planOptions.filter(opt => selectedPlans.includes(opt.value));
  const indicatorOptions: Option[] = indicators.map(i => ({ value: i.id, label: i.name }));
  const selectedIndicatorOptions = indicatorOptions.filter(opt => selectedIndicators.includes(opt.value));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Insira o texto da política da qualidade.");
      return;
    }
    await onSave(
      text.trim(),
      selectedPlanOptions.map(opt => opt.value),
      selectedIndicatorOptions.map(opt => opt.value)
    );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={7}
        placeholder="Digite a Política da Qualidade da sua empresa..."
        disabled={loading}
        maxLength={2000}
      />

      <div>
        <label className="block mb-1 text-sm font-medium">Planos de Ação Relacionados</label>
        {empresaId && (
          <QuickCreateActionPlan companyId={empresaId} onCreated={handleActionPlanCreated} />
        )}
        <MultiSelect
          options={planOptions}
          value={selectedPlanOptions}
          onChange={opts => setSelectedPlans(opts.map(opt => opt.value))}
          placeholder="Selecione os planos de ação"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Indicadores de Desempenho Relacionados</label>
        {empresaId && (
          <QuickCreateIndicator companyId={empresaId} onCreated={handleIndicatorCreated} />
        )}
        <MultiSelect
          options={indicatorOptions}
          value={selectedIndicatorOptions}
          onChange={opts => setSelectedIndicators(opts.map(opt => opt.value))}
          placeholder="Selecione os indicadores"
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
