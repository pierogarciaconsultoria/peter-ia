import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle, ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BscObjective, StrategicIdentity, SwotItem } from "@/types/strategic-planning";
import { Action5W2H } from "@/types/actions";
import { getStrategicIdentity } from "@/services/strategic-planning/strategicIdentityService";
import { getSwotItems } from "@/services/strategic-planning/swotService";
import { getObjectives } from "@/services/strategic-planning/bscService";
import { buildActionDraft, getStrategicActions, StrategicPillar } from "@/services/strategic-planning/strategicActionService";
import { ActionForm } from "@/components/actions/ActionForm";

const STATUS_LABELS: Record<Action5W2H["status"], string> = {
  planned: "Planejada",
  in_progress: "Em andamento",
  completed: "Concluída",
  delayed: "Atrasada",
  cancelled: "Cancelada",
};

const STATUS_VARIANT: Record<Action5W2H["status"], "default" | "secondary" | "destructive" | "outline"> = {
  planned: "outline",
  in_progress: "default",
  completed: "secondary",
  delayed: "destructive",
  cancelled: "outline",
};

interface PillarBoxProps {
  title: string;
  children: React.ReactNode;
  onCreate: () => void;
}

function PillarBox({ title, children, onCreate }: PillarBoxProps) {
  return (
    <div className="bg-muted/30 p-4 rounded-lg flex flex-col">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="text-sm text-muted-foreground mb-3 flex-1">{children}</div>
      <Button variant="outline" size="sm" className="w-full" onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Criar ação
      </Button>
    </div>
  );
}

export function StrategicActionPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<StrategicIdentity | null>(null);
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [objectives, setObjectives] = useState<BscObjective[]>([]);
  const [actions, setActions] = useState<Action5W2H[]>([]);
  const [draft, setDraft] = useState<Partial<Action5W2H> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [identityData, swotData, objectiveData, actionData] = await Promise.all([
        getStrategicIdentity(),
        getSwotItems(),
        getObjectives({ status: "active" }),
        getStrategicActions().catch(() => [] as Action5W2H[]),
      ]);
      setIdentity(identityData);
      setSwotItems(swotData);
      setObjectives(objectiveData);
      setActions(actionData);
    } catch (error) {
      console.error("Error fetching strategic planning data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do planejamento estratégico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDraft = (pillar: StrategicPillar) => setDraft(buildActionDraft(pillar));

  const swotByCategory = (category: SwotItem["category"]) => swotItems.filter(i => i.category === category);

  const swotLabels: Record<SwotItem["category"], string> = {
    strength: "Forças",
    weakness: "Fraquezas",
    opportunity: "Oportunidades",
    threat: "Ameaças",
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Plano de Ação Estratégico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Plano de Ação Estratégico</CardTitle>
        <p className="text-sm text-muted-foreground">
          Desdobre a estratégia em ações 5W2H. Iniciativas criadas a partir de um resultado-chave ficam ligadas a ele e entram no Plano de Ação com origem "Planejamento Estratégico".
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Ações já criadas a partir do planejamento */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ações estratégicas em andamento</h3>
            {actions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma ação com origem no planejamento estratégico ainda. Use os botões abaixo para criar a primeira.
              </p>
            ) : (
              <div className="divide-y rounded-md border">
                {actions.map(action => (
                  <div key={action.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.responsible} · prazo {action.due_date ? new Date(action.due_date).toLocaleDateString("pt-BR") : "-"}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[action.status] || "outline"}>
                      {STATUS_LABELS[action.status] || action.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Identidade */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Identidade Estratégica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PillarBox
                title="Missão"
                onCreate={() => openDraft({ type: "identity", label: "Missão", text: identity?.mission || "" })}
              >
                <p className="line-clamp-3">{identity?.mission || "Não definida"}</p>
              </PillarBox>
              <PillarBox
                title="Visão"
                onCreate={() => openDraft({ type: "identity", label: "Visão", text: identity?.vision || "" })}
              >
                <p className="line-clamp-3">{identity?.vision || "Não definida"}</p>
              </PillarBox>
              <PillarBox
                title="Valores"
                onCreate={() => openDraft({ type: "identity", label: "Valores", text: (identity?.values || []).join(", ") })}
              >
                <p className="line-clamp-3">
                  {identity?.values && identity.values.length > 0 ? identity.values.join(", ") : "Não definidos"}
                </p>
              </PillarBox>
            </div>
          </div>

          {/* SWOT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Análise SWOT</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(["strength", "weakness", "opportunity", "threat"] as SwotItem["category"][]).map(category => {
                const items = swotByCategory(category);
                return (
                  <PillarBox
                    key={category}
                    title={swotLabels[category]}
                    onCreate={() => openDraft({
                      type: "swot",
                      label: swotLabels[category],
                      text: items.map(i => i.description).join("; ") || swotLabels[category],
                    })}
                  >
                    <ul className="list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                      {items.length > 0
                        ? items.map(item => <li key={item.id} className="line-clamp-2">{item.description}</li>)
                        : <li>Nenhum item cadastrado</li>}
                    </ul>
                  </PillarBox>
                );
              })}
            </div>
          </div>

          {/* Objetivos e resultados-chave */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Objetivos e Resultados-chave</h3>
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum objetivo ativo. Crie objetivos na aba Metas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map(objective => (
                  <div key={objective.id} className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium flex items-center gap-1">
                        {objective.source === "ai" && <Sparkles size={12} className="text-primary shrink-0" />}
                        {objective.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => openDraft({ type: "bsc", label: "Objetivo", text: objective.title, objectiveId: objective.id })}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Ação
                      </Button>
                    </div>
                    {objective.measures.length > 0 && (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {objective.measures.map(kr => {
                          const linked = actions.filter(a => a.key_result_id === kr.id).length;
                          return (
                            <li key={kr.id} className="flex items-center justify-between gap-2">
                              <span className="line-clamp-1">
                                {kr.name}
                                {linked > 0 && <span className="ml-1 text-xs">({linked} iniciativa{linked > 1 ? "s" : ""})</span>}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 h-7 text-xs"
                                onClick={() => openDraft({ type: "kr", label: kr.name, text: kr.name, keyResultId: kr.id })}
                              >
                                <PlusCircle className="h-3.5 w-3.5 mr-1" /> Iniciativa
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={() => navigate("/action-schedule")} size="lg" className="gap-2">
              Ir para o Plano de Ação Completo
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={draft !== null} onOpenChange={(open) => { if (!open) setDraft(null); }}>
        {draft && (
          <ActionForm
            action={draft as Action5W2H}
            onClose={() => setDraft(null)}
            afterSubmit={fetchData}
          />
        )}
      </Dialog>
    </Card>
  );
}
