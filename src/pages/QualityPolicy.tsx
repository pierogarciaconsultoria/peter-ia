
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const QualityPolicy = () => {
  const { user, empresaId } = useCurrentUser() || {};
  const [qualityPolicy, setQualityPolicy] = useState<QP | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  async function handleSave(policyText: string) {
    if (!empresaId) {
      toast.error("Empresa não identificada.");
      return;
    }
    setLoading(true);
    try {
      const policy = await upsertQualityPolicy(
        empresaId,
        policyText,
        user?.id
      );
      setQualityPolicy(policy);
      setEditing(false);
      toast.success("Política salva com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar a política.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-3">Política da Qualidade</h1>
      <Card className="max-w-2xl w-full p-7">
        {loading ? (
          <div className="text-center text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="animate-spin" /> Carregando...
          </div>
        ) : editing || !qualityPolicy ? (
          <QualityPolicyForm
            value={qualityPolicy?.policy_text || ""}
            onSave={handleSave}
            loading={loading}
          />
        ) : (
          <div>
            <p className="text-lg mb-4 whitespace-pre-line">{qualityPolicy.policy_text}</p>
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
