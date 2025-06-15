
import { useEffect, useState } from "react";
import {
  fetchQualityObjectives,
  createQualityObjective,
  updateQualityObjective,
  deleteQualityObjective,
  QualityObjective
} from "@/services/qualityObjectivesService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, X } from "lucide-react";
import QualityObjectiveForm from "./QualityObjectiveForm";
import { toast } from "sonner";

export default function QualityObjectivesList() {
  const [objectives, setObjectives] = useState<QualityObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QualityObjective | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    setObjectives(await fetchQualityObjectives());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(obj: Omit<QualityObjective, "id" | "created_at" | "updated_at">) {
    setSaving(true);
    let result = false;
    if (editing) {
      const res = await updateQualityObjective(editing.id, obj);
      result = !!res;
      if (res) toast.success("Objetivo atualizado!");
    } else {
      const res = await createQualityObjective(obj);
      result = !!res;
      if (res) toast.success("Objetivo criado!");
    }
    if (result) {
      setDialogOpen(false);
      setEditing(null);
      await refresh();
    } else {
      toast.error("Falha ao salvar objetivo.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const ok = await deleteQualityObjective(id);
    if (ok) {
      toast.success("Objetivo excluído.");
      await refresh();
    } else {
      toast.error("Erro ao excluir.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Objetivos da Qualidade</h2>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2" size={16} />
          Novo Objetivo
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-6">Carregando...</div>
      ) : (
        <>
          {objectives.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Nenhum objetivo cadastrado ainda.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {objectives.map(obj => (
                <Card key={obj.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{obj.title}</CardTitle>
                        <CardDescription>
                          Status: <span className={
                            obj.status === "ativo"
                              ? "text-green-600"
                              : obj.status === "concluido"
                                ? "text-blue-600"
                                : "text-gray-400"
                          }>
                            {obj.status.charAt(0).toUpperCase() + obj.status.slice(1)}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(obj); setDialogOpen(true); }}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(obj.id)}>
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-muted-foreground">{obj.description}</div>
                    {obj.target_value !== undefined && (
                      <div className="flex gap-1 text-sm">
                        <span className="font-semibold">Meta:</span>
                        <span>{obj.target_value} {obj.unit}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DHeader>
            <DialogTitle>
              {editing ? "Editar Objetivo" : "Novo Objetivo"}
            </DialogTitle>
          </DHeader>
          <QualityObjectiveForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setDialogOpen(false); }}
            loading={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
