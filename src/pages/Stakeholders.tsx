import React, { useEffect, useState } from "react";
import { Stakeholder, fetchStakeholders, createStakeholder } from "@/services/stakeholderService";
import { StakeholderMatrix } from "@/components/stakeholders/StakeholderMatrix";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { StakeholderDialog } from "@/components/stakeholders/StakeholderDialog";
import { toast } from "sonner";

// Modos de Visualização
type ViewMode = "matrix" | "list";

const Stakeholders = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [view, setView] = useState<ViewMode>("matrix");
  const [loading, setLoading] = useState(true);

  // NOVO: Modal
  const [newOpen, setNewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchStakeholders().then(result => {
      if (mounted) {
        setStakeholders(result);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  async function handleCadastrar(form: Omit<Stakeholder, "id" | "created_at" | "updated_at">) {
    setSaving(true);
    const result = await createStakeholder(form);
    if (result) {
      toast.success("Parte Interessada cadastrada!");
      setNewOpen(false);
      // Atualiza lista
      setStakeholders(await fetchStakeholders());
    } else {
      toast.error("Erro ao cadastrar");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-start p-8 max-w-5xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className="text-3xl font-bold mb-2">Partes Interessadas</h1>
        <p className="text-lg text-muted-foreground mb-3 text-center max-w-xl">
          Analise e gerencie as partes interessadas da sua organização.
        </p>
        <div className="flex items-center gap-2 mb-2">
          <Button variant={view === "matrix" ? "default" : "outline"} size="sm" onClick={() => setView("matrix")}>
            Matriz
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            Lista
          </Button>
          <Button variant="secondary" size="sm" className="ml-2" onClick={() => setNewOpen(true)}>
            <Plus className="mr-1" size={16} /> Nova Parte Interessada
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Carregando partes interessadas...</div>
      ) : (
        <>
          {view === "matrix" ? (
            <StakeholderMatrix stakeholders={stakeholders} />
          ) : (
            <Card className="w-full max-w-2xl p-8 text-center text-muted-foreground animate-fade-in">
              <div className="mb-2">Exibição em lista será implementada em breve.</div>
              <div className="text-xs text-gray-400">Experimente a Matriz de Stakeholders!</div>
            </Card>
          )}
        </>
      )}

      {/* Modal de cadastro */}
      <StakeholderDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onSubmit={handleCadastrar}
        loading={saving}
      />
    </div>
  );
};

export default Stakeholders;
