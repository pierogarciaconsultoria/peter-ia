
import React, { useState, useEffect } from "react";
import QualityPolicyForm from "@/components/quality-policy/QualityPolicyForm";
import {
  fetchQualityPolicy,
  upsertQualityPolicy,
  QualityPolicy as QP,
} from "@/services/qualityPolicyService";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useActionPlans } from "@/hooks/useActionPlans";
import { usePerformanceIndicators } from "@/hooks/usePerformanceIndicators";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const QualityPolicy = () => {
  const { user, empresaId } = useCurrentUser() || {};
  const [qualityPolicy, setQualityPolicy] = useState<QP | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { actionPlans: allPlans, loading: loadingPlans } = useActionPlans(empresaId);
  const { indicators: allIndicators, loading: loadingIndicators } = usePerformanceIndicators(empresaId);

  useEffect(() => {
    async function loadPolicy() {
      if (!empresaId) return;
      setLoading(true);
      const policy = await fetchQualityPolicy(empresaId);
      setQualityPolicy(policy);
      setLoading(false);
    }
    loadPolicy();
  }, [empresaId]);

  async function handleSave(
    policyText: string,
    relatedActionPlans: string[],
    relatedIndicators: string[]
  ) {
    if (!empresaId) {
      toast.error("Empresa não identificada.");
      return;
    }
    setLoading(true);
    try {
      const policy = await upsertQualityPolicy(
        empresaId,
        policyText,
        user?.id,
        relatedActionPlans,
        relatedIndicators
      );
      setQualityPolicy(policy);
      setEditing(false);
      toast.success("Política salva com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar a política.");
    }
    setLoading(false);
  }

  // Helper para exibir os vinculados pelo ID
  const resolveByIds = <T extends { id: string; title?: string; name?: string }>(
    ids?: string[],
    source?: T[]
  ): T[] => {
    if (!ids || !source) return [];
    return ids
      .map(id => source.find(item => item.id === id))
      .filter(Boolean) as T[];
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-3">Política da Qualidade</h1>
      <Card className="max-w-2xl w-full p-7">
        {loading || loadingPlans || loadingIndicators ? (
          <div className="text-center text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="animate-spin" /> Carregando...
          </div>
        ) : editing || !qualityPolicy ? (
          <QualityPolicyForm
            value={qualityPolicy?.policy_text || ""}
            relatedActionPlans={qualityPolicy?.related_action_plans || []}
            relatedIndicators={qualityPolicy?.related_indicators || []}
            onSave={handleSave}
            loading={loading}
          />
        ) : (
          <div>
            <p className="text-lg mb-4 whitespace-pre-line">{qualityPolicy.policy_text}</p>

            {(qualityPolicy.related_action_plans?.length || 0) > 0 && (
              <div className="mb-2">
                <strong>Planos de Ação Relacionados:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {resolveByIds(qualityPolicy.related_action_plans, allPlans).map(plan => (
                    <li key={plan.id}>
                      <a
                        href="/action-schedule"
                        className="text-primary underline hover:opacity-80"
                        target="_blank"
                        rel="noopener"
                      >
                        {plan.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(qualityPolicy.related_indicators?.length || 0) > 0 && (
              <div className="mb-1">
                <strong>Indicadores de Desempenho Relacionados:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {resolveByIds(qualityPolicy.related_indicators, allIndicators).map(indicator => (
                    <li key={indicator.id}>
                      <a
                        href="/performance-indicators"
                        className="text-primary underline hover:opacity-80"
                        target="_blank"
                        rel="noopener"
                      >
                        {indicator.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="link"
                onClick={() => setEditing(true)}
                className="text-sm"
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QualityPolicy;
